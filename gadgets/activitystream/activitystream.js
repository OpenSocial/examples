
var template = Hogan.compile($.trim($("#activity_tmpl").text()));

for (var i = 0; i < activities.list.length; i++) {
  var context = activities.list[i];
  context.published = prettyDate(context.published);
  var rendered = template.render(context);
  $("#activity-stream").append(rendered);
}

for (var i = 0; i < newsfeed2.items.length; i++) {
  var context = newsfeed2.items[i];
  context.id = Date.now();
  context.actor.image.url = "photo.png";
  context.published = prettyDate("2012-10-16T15:01:00Z");
  var rendered = template.render(context);
  $("#activity-stream").append(rendered);
}
