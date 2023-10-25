onlives = {};

Main = function () {
 console.log("【バックグラウンドです。】", new Date);
 Get_follow_onlives();
 tabUpdated = false;
 //chrome.tabs.create({ "url": "https://www.showroom-live.com/" });
}

Get_follow_onlives = function () {
	let url =  "https://www.showroom-live.com/api/follow/onlives?genre_id";
	fetch(url)
	  .then((response) => response.json())
      .then((data) => {
        console.log(data);
        onlives = data;
        for (var i = 0, len = onlives.rooms.length; i < len; i++) {
          console.log(onlives.rooms[i].room_name ,":" , onlives.rooms[i].room_url_key);
          followopen("https://www.showroom-live.com/r/" + onlives.rooms[i].room_url_key,i);
        }
         live_tab_remove();
      });
      
}

live_tab_remove = function () {
	chrome.tabs.query({windowType:'normal'}, function(tabs) {
      if (tabs.length == 0) {return;}

      for (var i = 0, tab; tab = tabs[i]; i++) {
        if (tab.url && (tab.url.indexOf("https://www.showroom-live.com/r/") == 0)) {
        	var remove = true;
        	for (var j = 0, len = onlives.rooms.length; j < len; j++) {
        	 if (tab.url.indexOf("https://www.showroom-live.com/r/" + onlives.rooms[j].room_url_key) == 0) {
        	  remove = false;
        	 }
        	}
        if (remove) {chrome.tabs.remove(tabs[i].id, null);}
        }
      }
    });
}

followopen = function (open_url,num) {
    chrome.tabs.query({windowType:'normal'}, function(tabs) {
      if (tabs.length == 0) {return;}

      for (var i = 0, tab; tab = tabs[i]; i++) {
        if (tabs[i].url == 'https://www.showroom-live.com/undefined') {
         chrome.tabs.remove(tabs[i].id, null);
         return;
        }

//        if (tab) {console.log(tab.url);}
        // console.log(premium_room_url);
        if (tab.url && (tab.url.indexOf("premium_live") > 0)) {
          chrome.tabs.remove(tabs[i].id, null);
          console.log(tab.url.indexOf("premium_live"));
          continue;
        }

        if (tab.url.indexOf('devtools:') >= 0) {
//          console.log('devtools:は邪悪');
          return;
        }


        if (tab.url && tab.url == open_url) {
          setTimeout(() => {chrome.tabs.update( tab.id, {selected:true}, function(tab){});}, 1000 * num);
          return;
        }
      }
      chrome.tabs.create({url: open_url});
    });
  }
  

Main();

// 1分毎実行
chrome.alarms.create("start_count_1", { "periodInMinutes": 1 });

// alarmsイベント取得
chrome.alarms.onAlarm.addListener(function (alarm) {
    if (alarm.name == "start_count_1") {
        Main();
    }
});
