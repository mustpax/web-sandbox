function out(str) {
    var $out = $('#out');
    $out.text($out.text() + str + '\n');
}

// I have to use jQuery instead of $ because of Prototype and other conflicts.
// I've heard that I can use a no conflict function to take care of that, though?
jQuery(function() {
    // Where and how do I set a cookie to count visits?
    // [Mustafa] You can set a cookie right here

    $('#updates').show();
	// Should I use .ajax here? What's the difference between that and .get and .getJSON and making an object with a JSONscriptRequest?
    // [Mustafa] Using .ajax is the right thing to use, it's more flexible. You can do everything with .ajax that you can do with .get
    //           .get is a convenience method that does a .ajax request with type: "GET"
    //           .getJSON is like .get but assumes that the response JSON formatted
    jQuery.ajax({
    	type: "GET",
    	// Do I put "&callback=" on the end of this? When is that applicable?
        // [Mustafa] When you set dataType to 'jsonp' jQuery adds the callback parameter itself, so you don't need to bother with it.
        url: 'http://api.getsatisfaction.com/companies/gsfnmichelle/topics.json?style=update',
        // JSON or JSONP? I think JSONP takes care of the cross-domain problem by returning the information in a function--is that right?
        // [Mustafa] Yes this is right. You should use JSONP for cross-domain requests. GetSatisfaction API supports JSONP, but some other APIs might not.
        dataType : 'jsonp',
        // "data" refers to whatever results the call returns, right?
        // [Mustafa] Yes. jQuery will parse the data for you.
        success: function(data) {
            var visits = $.cookie('visits') || '0';
            visits = parseInt(visits);
            $('#visits').text('Visits: ' + visits);
            $.cookie('visits', visits + 1);

            if (data.total) {
                // You have to iterate over each 'issue' you get back from the API
                // .each works like a for loop in other languages
                $.each(data.data, function() {
                    var updateTitle = this.subject;
                    var updateURL = this.at_sfn;
                    // Is this how I make the returned updateTitle and updateURL show up in the banner?
                    // [Mustafa] You can do it like so.
                    var elem = $('<li><a href="' + updateURL + '">' + updateTitle + '</a></li>');
                    console.log(elem);
                    $('#updates h2').text('Found ' + data.total + ' updates.');
                    $('#updates ul').append(elem);
                });
            } else {
                // How do I indicate what should happen with no success/no results?
                // [Mustafa] You can write the code here to do that.
                $('#updates h2').text('No updates');
            }

        }
    });
});

