import PubNub from 'pubnub';
import _ from 'lodash';

import { publishKey, subscribeKey } from '../utils/globals';

const pubnub = new PubNub({
    subscribeKey: subscribeKey,
    publishKey: publishKey,
    // uuid: PubNub.generateUUID(),
    ssl: true,
});

export default class PubnubService {

    static getEnvironment = () => {
        // const environment = "development"; // production
        const environment = "production"; // development
        return environment;
    }

    static getBundleId = () => {
        const bundleId = "com.chatapp";
        return bundleId;
    }

    static addChannels = (channel, device, pushGateway) => {
        pubnub.push.addChannels({
            channels: [channel],
            device,
            pushGateway,
            environment: this.getEnvironment(),   // required for APNs2 development
            topic: this.getBundleId(), // required for APNs2
        }, (status, response) => {
            console.log("AddChannels ===>", status, response);
        });
    }

    static listChannels = (device, pushGateway) => {
        pubnub.push.listChannels({
            device,
            pushGateway,
            environment: this.getEnvironment(),   // required for APNs2 development
            topic: this.getBundleId(), // required for APNs2
        }, (status, response) => {
            console.log("ListChannels ===>", status, response);
        });
    }

    static removeChannels = (channel, device, pushGateway) => {
        pubnub.push.removeChannels({
            channels: channel,
            device,
            pushGateway,
            environment: this.getEnvironment(),   // required for APNs2 development
            topic: this.getBundleId(), // required for APNs2
        }, (status, response) => {
            console.log("RemoveChannels ===>", status, response);
        });
    }

    static setChannel = (members, callback) => {
        const shakerId = _.get(members, "[0].id", "");
        const moovverId = _.get(members, "[1].id", "");
        const channel = shakerId + "_" + moovverId;
        const owner = _.get(members, "[0].name", "");
        const data = {
            custom: { owner }
        }
        pubnub.objects.setChannelMetadata({
            channel,
            data
        }, (status, response) => {
            // console.log("SetChannelMetadata ===>", status, response);
            // if (status.error) {
            //     if (status.errorData.status === 409) {
            //         /* chat instance already created in pubnub */
            //         callback && callback({ id })
            //         return;
            //     }
            //     return;
            // }
            // else if (response.data) {
            //     callback && callback(response.data)
            // }
            callback && callback(status, response)
        });
    }

    static getChannel = (spaceId, callback) => {
        pubnub.objects.getChannelMetadata({
            channel: spaceId
        }, (status, response) => {
            console.log("GetChannelMetadata ===>", status, response)
            if (status.error) {
                return
            }
            else if (response.data) {
                callback && callback(response.data)
            }
        })
    }

    static setMembers = (users, spaceId, callback) => {
        const customResponse = { status: true }
        users.forEach((user, index) => {
            this.setUUID(spaceId, user, (status, response) => {
                // console.log("SetUUID ===>", status, response);
                if (status.error) {
                    // customResponse['status'] = false;
                    // callback && callback(customResponse)
                    callback && callback(status, response)
                } else {
                    const channel = spaceId;
                    const id = users[index].id;
                    const uuids = [
                        id,
                        { id, custom: { trialPeriod: false } },
                    ]
                    pubnub.objects.setChannelMembers({
                        channel, uuids
                    }, (status, response) => {
                        // console.log("SetChannelMembers ===>", response);
                        // if (status.error) {
                        //     customResponse['status'] = false
                        // }
                        // if (response) {
                        //     customResponse['status'] = true
                        // }
                        // callback && callback(customResponse)
                        if (users.length == index + 1) {
                            callback && callback(status, response)
                        }
                    });
                }
            });
        });
    }

    static setUUID = (spaceId, user, callback) => {
        pubnub.objects.getChannelMembers({
            channel: spaceId
        }, (status, response) => {
            // console.log("GetChannelMembers ===>", status, response);
            if (status.error) {
                callback && callback(status, response)
            } else if (response.data) {
                let users = response.data
                if (users.length == 0 || !users.some((u) => u.id == user.id)) {
                    const data = {
                        id: user._id,
                        name: user.name
                    }
                    pubnub.objects.setUUIDMetadata({
                        data
                    }, (status, response) => {
                        // console.log("SetUUIDMetadata ===>", status, response);
                        callback && callback(status, response)
                    })
                } else {
                    callback && callback(status, response)
                }
            }
        });
    }

    static fetchMessages = (spaceIds, count = 25, callback) => {
        pubnub.fetchMessages({ channels: spaceIds, count },
            (status, response) => {
                // console.log("FetchMessages ===>", status, response)
                if (status.error) {
                    callback && callback([])
                }
                else if (response) {
                    const channels = _.get(response, "channels", "")
                    if (channels) {
                        callback && callback(channels)
                    }
                }
            })
    }

    static publish = async (spaceId, message) => {
        pubnub.publish({
            channel: spaceId,
            message
        }, (status, response) => {
            console.log("Publish ===>", status, response)
        });
    }

    static addListener = (callback) => {
        pubnub.addListener({
            message: messageEvent => {
                callback && callback(messageEvent)
            }
        })
    }

    static subscribe = (spaceId) => {
        pubnub.subscribe({ channels: [spaceId] })
    }


    //For read unread count
    static getMemberships = (uuid, callback) => {
        pubnub.objects.getMemberships({
            uuid: uuid,
            include: {
                customFields: true,
                channelFields: true,
                customChannelFields: true,
            }
        }, (status, response) => {
            // console.log("GetMemberships ===>", status, response);
            if (status.error) {
                return
            }
            else if (response.data) {
                callback && callback(response.data)
            }
        })
    }

    static setMemberships = (uuid, spaceId, callback) => {
        pubnub.objects.setMemberships({
            uuid: uuid,
            channels: [{
                id: spaceId,
                custom: {
                    lastReadTimetoken: new Date() * 10000,
                    trialPeriod: false,
                    isChat: true,
                },
                include: {
                    // To include channel fields in response
                    channelFields: true
                }
            }]
        }, (status, response) => {
            // console.log("SetMemberships ===>", status, response);
            if (status.error) {
                return
            }
            else if (response.data) {
                callback && callback(response.data)
            }
        })
    }

    static messageCounts = (spaceIds, timeTokens, callback) => {
        pubnub.messageCounts({
            channels: spaceIds,
            channelTimetokens: timeTokens
        }, (status, response) => {
            // console.log("MessageCounts ===>", status, response);
            if (status.error) {
                return
            }
            else if (response) {
                callback && callback(response)
            }
        })
    }

    static getUnreadCounts = (logInUserId, callback) => {
        PubnubService.getMemberships(logInUserId, (response) => {
            if (response != null && response.length > 0) {
                var timeTokens = []
                var channels = []
                response.map((item) => {
                    // if (item.custom.lastReadTimetoken != null) {
                    if (item.custom.lastReadTimetoken != null && item.custom.isChat) {
                        channels.push(item.channel.id)
                        timeTokens.push(item.custom.lastReadTimetoken)
                    }
                });
                timeTokens.length > 0 && PubnubService.messageCounts(channels, timeTokens, (response) => {
                    if (response != null && response.channels != null) {
                        var unreadCountSum = 0;
                        for (var key in response.channels) {
                            // check if the property/key is defined in the object itself, not in parent
                            if (response.channels.hasOwnProperty(key)) {
                                // console.log(key, response.channels[key]);
                                unreadCountSum = unreadCountSum + response.channels[key]
                            }
                        }
                        callback(unreadCountSum)
                    }
                    return
                })
            }
        })
    }
}