var http = require('http');
var url = 'http://www.imooc.com/learn/348';
var cheerio = require('cheerio');
function fenxi(data) {
  var $ = cheerio.load(data);
  var chapter = $('.chapter');

  //想要的数组的样式
  // [
  //   {
  //     chapterTitle:
  //     video:[
  //       title:
  //       id:
  //     ]
  //   }
  // ]

var courseData = [];

chapter.each(function (item) {
  var chapter = $(this);
  var chapterTitle = chapter.find('strong').text();
  var videos = chapter.find('.video').children('li');

  var chapterData = {
    chapterTitle:chapterTitle,
    videos:[]
  };

  videos.each(function (item) {
    var video = $(this).find('.J-media-item');
    var videoId = video.attr('href').split('video/')[1];
    var videoTitle = video.text();

    chapterData.videos.push({
      videoId:videoId,
      videoTitle:videoTitle
    });
  });
  courseData.push(chapterData);
});
  return courseData;
}

function printCourse(courseData) {
  courseData.forEach(function (item) {
     console.log('chapterTitle' + item.chapterTitle + '\n');
    item.videos.forEach(function (item) {
     console.log('【' + item.videoId + '】' + item.videoTitle + '\n');
    });
  });
}

http.get(url,function (res) {
  var html = '';

  res.on('data',function (data) {
    html += data;
  });

  res.on('end',function () {
    var courseData = fenxi(html);
    printCourse(courseData);
  });
}).on('error',function () {
  console.log('获取出错！');
});
