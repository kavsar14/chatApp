export const getFilteredChannelId = (oppositeId, userId, chatChannels) => {
      let channel = chatChannels?.filter((temp) => {
        if((temp.userIdOne == userId && temp.userIdTwo == oppositeId) || 
        (temp.userIdOne == oppositeId && temp.userIdTwo == userId)) {
          return temp.channelId
        }
      })
      //console.log('channel :', channel[0]?.channelId);
      if(channel.length > 0) {
        return channel[0]?.channelId;
      } else {
        return '';
      }
}

export const getFilteredChannelDocId = (oppositeId, userId, chatChannels) => {
    let channel = chatChannels?.filter((temp) => {
      if((temp.userIdOne == userId && temp.userIdTwo == oppositeId) || 
      (temp.userIdOne == oppositeId && temp.userIdTwo == userId)) {
        return temp.channelId
      }
    })
    //console.log('channel :', channel[0]?.channelId);
    if(channel.length > 0) {
      return channel[0]?.id;
    } else {
      return '';
    }
}

export const getChannelLastMessage = (oppositeId, userId, chatChannels) => {
    let channel = chatChannels?.filter((temp) => {
      if((temp.userIdOne == userId && temp.userIdTwo == oppositeId) || 
      (temp.userIdOne == oppositeId && temp.userIdTwo == userId)) {
        return temp.channelId
      }
    })
    //console.log('channel :', channel[0]?.channelId);
    if(channel.length > 0) {
      return channel[0]?.lastMessage;
    } else {
      return '';
    }
}