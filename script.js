function out(str) {
    var $out = $('#out');
    $out.text($out.text() + str + '\n');
}

// I have to use jQuery instead of $ because of Prototype and other conflicts.
// I've heard that I can use a no conflict function to take care of that, though?
jQuery(function() {
	// Should I use .ajax here? What's the difference between that and .get and .getJSON and making an object with a JSONscriptRequest?
    jQuery.ajax({
    	type: "GET",
    	// Do I put "&callback=" on the end of this? When is that applicable?
        url: 'http://api.getsatisfaction.com/companies/gsfnmichelle/topics.json?style=update',
        // JSON or JSONP? I think JSONP takes care of the cross-domain problem by returning the information in a function--is that right?
        dataType : 'jsonp',
        // "data" refers to whatever results the call returns, right?
        success: function(data) {
        	var updateTitle = data.subject
        	var updateURL = data.at_sfn
        	// Where and how do I set a cookie to count visits?
        	// Is this how I make the returned updateTitle and updateURL show up in the banner?
        	jQuery(#updates).show().html('<h2 class="loading">Loading a company update . . .</h2>').html('<a href="updateURL" id="theUpdate" src="updateURL", "updateTitle">');
        }
        // How do I indicate what should happen with no success/no results?
        else:
        	jQuery(#updates).hide();
    });
});

