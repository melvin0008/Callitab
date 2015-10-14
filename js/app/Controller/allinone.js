chromeext.controller("TodoCntrl",function TodoCntrl($scope,$route,$window,$routeParams,$filter,$http,$timeout,localStorageService)	
{

//Array of images which you want to show: Use path you want.
var images=new Array('images/a.jpg','images/b.jpg','images/c.jpg','images/d.jpg','images/e.jpg','images/f.jpg','images/g.jpg','images/h.jpg','images/i.jpg','images/j.jpg','images/k.jpg','images/l.jpg','images/m.jpg','images/n.jpg','images/o.jpg','images/p.jpg','images/q.jpg','images/r.jpg','images/s.jpg','images/t.jpg');
var promise;
var randno=Math.floor((Math.random() * 15));
var nextimage=randno;
$(document).ready(function() {

	if(localStorageService.get('nop'))
	{
		$scope.nameofperson=localStorageService.get('nop')
	}

	doSlideshow();
	date_time();
	weather();
	wordoftheday();
});
$scope.$on('$locationChangeStart', function(){

});

$(document).ready(function(){
	$(document).ready(function() {
		$('#popover').click(function() {
			$('#todo').toggle("slide");
		});
	});
});
$(document).ready(function() {
	$('#popoverweather').click(function() {
		$('#weather').slideToggle("fast");
	});
});


	//$scope.slides = [{image:'images/a.jpg'},{image:'images/b.jpg'},{image:'images/c.jpg'}];
	$scope.editedTodo = null;
	$scope.$watch('todos', function (newValue, oldValue) {
			if (newValue !== oldValue) { // This prevents unneeded calls to the local storage
				savelocal();
			}
		}, true);

	$scope.$on('$routeChangeSuccess', function () {

		if($routeParams.status==='active' || $routeParams.status==='completed')
		{
			var status = $scope.status = $routeParams.status || '';
			$scope.statusFilter = (status === 'active') ?
			{ done: false } : (status === 'completed') ?
			{ done: true } : null;
			console.log("Illappo");
		}
	});
	$scope.$on('$destroy', function(){
		$timeout.cancel(promise);
	});

	var saved=localStorageService.get('currenttodo');
	if(saved)
	{
		if(saved.length!==0)
		{
			$scope.todos=saved;
		}
		else
		{
			$scope.todos=[];	
		}
	}
	else
	{
		$scope.todos=[];	
	}

	
	$scope.addTodo=function()
	{
		
		if($scope.todotext)
		{	
			var flag=0;
			var i;
			if($scope.todos.length)
			{
				for(i=0;i<$scope.todos.length;i++)
				{
					if($scope.todotext==$scope.todos[i].text)
					{
						flag=1;
					}
				}
			}
			if(flag==0)
			{
				var newtodo={
					done:false,
					text:$scope.todotext
				};

				$scope.todos.unshift(newtodo);
				$scope.todotext="";
			}
			else
			{
				$('#table-modal').modal('show');		
			}

	//		savelocal();
}
};

$scope.addname=function(){
	if($scope.nop)
	{
		localStorageService.set('nop',$scope.nop);
		$route.reload();
	}

};

$(document).ready(function() {
	$('#js-news').ticker({
		htmlFeed: false,
		ajaxFeed: true,
		feedUrl: 'http://rss.cnn.com/rss/cnn_topstories.rss',
		feedType: 'xml'
	});

});



$scope.removeTodo=function(todo)
{
	var i;
	for(i=0;i<$scope.todos.length;i++)
	{
		if($scope.todos[i].text==todo.text)
		{
			$scope.todos.splice(i,1);
		}
	}
	//	savelocal();
};

function savelocal()
{
	localStorageService.set('currenttodo',$scope.todos);

};
function doSlideshow(){
	var randno=Math.floor((Math.random() * 15));
	if(nextimage>=images.length){nextimage=randno;}
	$('.wrapper')
	.css('background-image','url("'+images[nextimage++]+'") ')
	.css('background-size','100% 100%')
	.fadeIn(500,function(){
		promise= $timeout(doSlideshow,60000,true);
	});
};

function date_time()
{
	date = new Date;
	year = date.getFullYear();
	month = date.getMonth();
	months = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');
	d = date.getDate();
	h = date.getHours();
	m=date.getMinutes(); 
	s = date.getSeconds();
	var hr=((h + 11) % 12) + 1;
	if(hr<10)
	{
		hr = "0"+hr;
	}
	var per=(h>12)?'PM':'AM';

	if(m<10)
	{
		m = "0"+m;
	}

	if(s<10)
	{
		s = "0"+s;
	}
	var formattedTime=hr+':'+m;

      	//var formattedTime=format_date(date); 
      	var greeting;
      	if (h>=4&&h<12) {greeting="Good Morning";}
      	else if(h>=12&&h<17){greeting="Good Afternoon";}
      	else if(h>=17&&h<21){greeting="Good Evening";}
      	else if(h>=21||h<4){greeting="Good Night";}
      	var sub=ordinal(d);

      	$scope.greeting=greeting;
      	$scope.date = ''+sub+' '+months[month];
      	$scope.time=formattedTime;
      	$scope.sec=s;
      	$scope.period=per;
      	$timeout(date_time,1000,true);
      };
      function weather()
      {
      	var lat,lon;
      	var id; 
      	window.navigator.geolocation.getCurrentPosition(function(position) {
      		$scope.$apply(function() {
      			lat= position.coords.latitude;
      			lon= position.coords.longitude;



      			$http.get("http://api.openweathermap.org/data/2.5/find?lat="+lat+"&lon="+lon+"&cnt=1&APPID=49e35400a21b91363eec35ae6b56967d")
      			.success(function(data){
      				if(data)
      				{

      					id=data.list[0].id;
      					$http.get("http://api.openweathermap.org/data/2.5/weather?id="+id+"&APPID=49e35400a21b91363eec35ae6b56967d")
      					.success(function(data) {
      						var receiveddata = data;
			       // $scope.position=data;
			       if(receiveddata)
			       {

			       	var tempdesc=(receiveddata.weather[0].description);
			       	$scope.description=tempdesc.charAt(0).toUpperCase()+tempdesc.slice(1);
			       	var temp=Math.round((receiveddata.main.temp-273.15));
			       	$scope.temp=temp;
			       	$scope.far=Math.round(temp*1.8+21);
			       	var sunrise=receiveddata.sys.sunrise;
			       	var date1=new Date(sunrise*1000);
			       	$scope.sunrise=format_date(date1);
			       	var sunset=receiveddata.sys.sunset;
			       	date1=new Date(sunset*1000);
			       	$scope.sunset=format_date(date1)
			       	$scope.wind=receiveddata.wind.speed;
			       	$scope.pressure=receiveddata.main.pressure;
			       	$scope.place=receiveddata.name;
			       	$scope.icon="http://openweathermap.org/img/w/"+receiveddata.weather[0].icon+".png";
			       }
			        //$scope.k=receiveddata.weather[0].description;
			    });


      				}

      			});
      //$scope.position=$scope.lid;
  });
});
$timeout(weather,600000,true);
};
function format_date(date)
{
	h = date.getHours();
	m=date.getMinutes(); 
	s = date.getSeconds();
	var hr=((h + 11) % 12) + 1;
	if(hr<10)
	{
		hr = "0"+hr;
	}
	var per=(h>12)?'PM':'AM';

	if(m<10)
	{
		m = "0"+m;
	}

	if(s<10)
	{
		s = "0"+s;
	}
	var formattedTime=hr+':'+m+':'+s+' '+per;
	return formattedTime;
};
function wordoftheday()
{

	date = new Date;
	year = date.getFullYear();
	month = date.getMonth();
	d = date.getDate();
	2014-06-29
	var today=year+"-"+month+"-"+d;
	$http.get("http://api.wordnik.com/v4/words.json/wordOfTheDay?date="+today+"&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5")
	.success(function(data) {
		var receiveddata = data;
		if(receiveddata)
		{
			$scope.word=receiveddata.word;
			$scope.def=receiveddata.definitions[0].text;
		}
        //$scope.k=receiveddata.weather[0].description;
    });
	$timeout(wordoftheday,60000*60*24,true);

};
function ordinal(num) {
	ones = num % 10;
	tens = Math.floor(num / 10) % 10;
	if (tens == 1) {
		suff = "th";
	} else {
		switch (ones) {
			case 1 : suff = "st"; break;
			case 2 : suff = "nd"; break;
			case 3 : suff = "rd"; break;
			default : suff = "th";
		}
	}
	return num+suff;
};

});

