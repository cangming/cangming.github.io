"use strict";

function createId() {
	var ALPHABET =
	  '23456789abdegjkmnpqrvwxyz';
	var ALPHABET_LENGTH = ALPHABET.length;
	var ID_LENGTH = 8;
  var rtn = '';
  for (var i = 0; i < ID_LENGTH; i++) {
    rtn += ALPHABET.charAt(Math.floor(Math.random() * ALPHABET_LENGTH));
  }
  return rtn;
}
function initTaipeiTimer() {
	var taipei_date = new Date("Sep 15, 2018 12:30:00").getTime();
	makeCountdownTimer(taipei_date, 'taipei-timer');
}

function initChanghuaTimer() {
	var changhua_date = new Date("Nov 25, 2018 12:00:00").getTime();
	makeCountdownTimer(changhua_date, 'changhua-timer');
}

function makeCountdownTimer(date, class_name) {
	var x = setInterval(function() {
		var d = new Date();
		var now = d.getTime();
		var tz_diff = (-480 - d.getTimezoneOffset()) * 60;
		var distance = date - now + tz_diff;

		// Time calculations for days, hours, minutes and seconds
		var days = Math.floor(distance / (1000 * 60 * 60 * 24));
		var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
		var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
		var seconds = Math.floor((distance % (1000 * 60)) / 1000);

		var targets = document.getElementsByClassName(class_name);
		// If the count down is finished, write some text
		if (distance < 0) {
			clearInterval(x);
			for (var i = 0; i < targets.length; i++) {
				targets[i].innerHTML = "EXPIRED";
			}
			return;
		}

		//create Table Body
		var time = [days, '：', paddingZero(hours), '：', paddingZero(minutes), '：', paddingZero(seconds)];
		var unit = ['DAYS', "", 'HOURS', "", 'MINUTES', "", "SECONDS"];

		var table = document.createElement('table');
		table.align = 'center';
		{
			var tr=document.createElement('tr');
			tr.style.margin='auto';
			for(var column in time){
				var td=document.createElement('td');
				td.innerHTML = '<h3 class="inverse">' + time[column] + '</h3>';
				tr.appendChild(td)
			}
			table.appendChild(tr);
		}
		{
			var tr=document.createElement('tr');
			for(var column in unit){
				var td=document.createElement('td');
				td.innerHTML = '<h6 class="inverse" style="color: #808080;">' + unit[column] + '</h6>';
				tr.appendChild(td)
			}
			table.appendChild(tr);
		}
		for (var i = 0; i < targets.length; i++) {
			targets[i].innerHTML = "";
			var cln = table.cloneNode(true);
			targets[i].appendChild(cln);
		}

	}, 1000);
}
function paddingZero(data) {
	if (data < 10) {
		return '0' + data.toString();
	}
	return data;
}
function recaptchaCallback()
{
	$('#submitBtn').removeAttr('disabled');
}

function getJoinTypeFormAction(type)
{
	switch (type) {
	case "both":
		var target = 1;
		break;
	case "engage":
		var target = 2;
		break;
	case "merry":
		var target = 3;
		break;
	case "ticket_only":
		var target = 4;
		break;
	case "no_join":
		var target = 5;
		break;
	default:
		var target = 1;
	}
	var status = [
		/*div id,			both, engage, merry, ticket_only,	no_join*/
		["div_engage",	    true, false,  false, false,			false],
		["div_personPlus_0",true, true,   true,	 false,			false],
		["div_vegetarian_0",true, true,   true,	 false, 		false],
		["div_child_0", 	true, true,   true,	 false, 		false],

		["div_merry",	    true, false,  false, false,			false],
		["div_personPlus_1",true, false,  false, false, 		false],
		["div_vegetarian_1",true, false,  false, false, 		false],
		["div_child_1", 	true, false,  false, false, 		false],

		["div_phone", 		true, true,   true,  true, 			false],
		["div_address", 	true, true,   true,  true,  		false]
	];
	var result = [];
	for (var i in status) {
		var data = [status[i][0], status[i][target]];
		result.push(data);
	}
	return result;
}

function setFormVisible(type)
{
	var formAction = getJoinTypeFormAction(type);
	for (var i in formAction) {
		var target = formAction[i][0];
		var show = formAction[i][1];
		var dom = document.getElementById(target);
		if (show) {
			dom.style.display = null;
		} else {
			dom.style.display = "none";
		}
	}
}

function clearError()
{
	var target = ['div_name', 'div_personPlus_0', 'div_personPlus_1',
		'div_phone', 'div_address', 'div_vegetarian_0', 'div_vegetarian_1',
		'div_child_0', 'div_child_1'];
	for (var i in target) {
	  document.getElementById(target[i]).classList.remove("has-error");
	}
}

function addError(name)
{
	document.getElementById(name).classList.add("has-error");
}

function serverResponse(e)
{
	var info = "", skip_reload_recaptcha = false;
	clearError();
	switch (e.result) {
	case '200':
		info = '我們已經收到您的回復，感謝您！';
		skip_reload_recaptcha = true;
		break;
	case '201':
		info = '雖然已經超過報名時間，但我們還是有保留您的資料，再麻煩與我們連繫確認，感謝您！';
		skip_reload_recaptcha = true;
		break;
	case '403':
		info = '你被 google 當成機器人 QQ，再麻煩證明一次你不是機器人';
		break;
	case '503':
		info = '現在太多人登記，麻煩您稍候再試！';
		break;
	case '1001':
		info = '名字欄位未填寫，再麻煩您檢查一下喔！';
		addError('div_name');
		break;
	case '1002':
		info = '親友問題有錯，再麻煩您檢查一下喔！';
		break;
	case '1003':
		info = '出席問題有錯，再麻煩您檢查一下喔！';
		break;
	case '1004':
		info = '攜伴人數有錯，再麻煩您檢查一下喔！';
		addError('div_personPlus_0');
		break;
	case '1011':
		info = '攜伴人數有錯，再麻煩您檢查一下喔！';
		addError('div_personPlus_1');
		break;
	case '1005':
		info = '聯絡電話未填寫，再麻煩您檢查一下喔！';
		addError('div_phone');
		break;
	case '1006':
		info = '聯絡地址未填寫，再麻煩您檢查一下喔！';
		addError('div_address');
		break;
	case '1007':
		info = '素食人數有錯，再麻煩您檢查一下喔！';
		addError('div_vegetarian_0');
		break;
	case '1008':
		info = '素食人數比來的人多，再麻煩您檢查一下喔！';
		addError('div_vegetarian_0');
		break;
	case '1012':
		info = '素食人數有錯，再麻煩您檢查一下喔！';
		addError('div_vegetarian_1');
		break;
	case '1013':
		info = '素食人數比來的人多，再麻煩您檢查一下喔！';
		addError('div_vegetarian_1');
		break;
	case '1009':
		info = '兒童座椅數量有錯，再麻煩您檢查一下喔！';
		addError('div_child_0');
		break;
	case '1010':
		info = '兒童座椅比來的人多，再麻煩您檢查一下喔！';
		addError('div_child_0');
		break;
	case '1014':
		info = '兒童座椅數量有錯，再麻煩您檢查一下喔！';
		addError('div_child_1');
		break;
	case '1015':
		info = '兒童座椅比來的人多，再麻煩您檢查一下喔！';
		addError('div_child_1');
		break;
	default:
		info = '不知道哪裡錯了，麻煩聯絡新郎官解個Bug QQ';
	}
	alert(info);
	if (!skip_reload_recaptcha) {
		grecaptcha.reset();
		document.getElementById("submitBtn").disabled = true;
	}
}

function initMap()
{
	var map_info = [{
		div_id: 'taipei_map',
		url: 'https://www.google.com/maps/embed/v1/place?key=AIzaSyBlD-vfwj6iVbA4QwLF64tmYvjFvwk6Bbk&q=頤品大飯店+新北北新館,Seattle+WA'
	}, {
		div_id: 'changhua_map',
		url: 'https://www.google.com/maps/embed/v1/place?key=AIzaSyBlD-vfwj6iVbA4QwLF64tmYvjFvwk6Bbk&q=彰化福泰商務飯店,Seattle+WA'
	}];
	for (var i in map_info) {
		var dom = document.getElementById(map_info[i].div_id);
		dom.src = map_info[i].url;
	}
}

$('#submitBtn').on('click', function(e) {
	var data = $('form#reg_form');
	$.ajax({
		type: "GET",
		url: "https://script.google.com/macros/s/AKfycbyObPdgHvNcWLnd7038NL9tpu4oGu9OAqHrMRi5KRM9elFC31H_/exec",
		data: data.serialize(),
		jsonpCallback: "serverResponse",
		dataType: "JSONP"
	});
});

function initImg()
{
	[].forEach.call(document.querySelectorAll('img[data-src]'), function(img) {
		img.setAttribute('src', img.getAttribute('data-src'));
		img.onload = function() {
			img.removeAttribute('data-src');
		};
	});
}

/* main function */
(function(){
	initTaipeiTimer();
	initChanghuaTimer();
})();

$(document).ready(function() {
	$(window).on('load', function() {
		initMap();
		baguetteBox.run('.tz-gallery');
		initImg();
	});
});

