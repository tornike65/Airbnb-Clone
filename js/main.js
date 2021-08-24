var info = {
  location: "",
  date: "",
  guest: "",
}

var searchBtn = document.querySelector(".searchBtn");
var location1 = document.querySelector(".location");
var date1 = document.querySelector(".date");
var guest = document.querySelector(".guest");

searchBtn.addEventListener("click", function () {
  info.location = location1.value
  info.date = date1.value
  info.guest = guest.value
  localStorage.setItem("searchInfo", JSON.stringify(info))
  var href = window.location.href;
  var splitHref = href.split("/");
  splitHref.pop();
  splitHref.push("search.html");
  var newUrl = splitHref.join("/");
  window.location.href = newUrl;
});







$(function () {
  $('input[name="daterange"]').daterangepicker({
    opens: 'left'
  }, function (start, end, label) {
    console.log("A new date selection was made: " + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD'));
  });
});
