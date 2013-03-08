var cols = {"Discounted Instance Hour": true, "Frontend Instance Hours": true};

/* For a given date, get the ISO week number
 *
 * Based on information at:
 *
 *    http://www.merlyn.demon.co.uk/weekcalc.htm#WNR
 *
 * Algorithm is to find nearest thursday, it's year
 * is the year of the week number. Then get weeks
 * between that date and the first day of that year.
 *
 * Note that dates in one year can be weeks of previous
 * or next year, overlap is up to 3 days.
 *
 * e.g. 2014/12/29 is Monday in week  1 of 2015
 *      2012/1/1   is Sunday in week 52 of 2011
 */
function getWeekNumber(d) {
    // Copy date so don't modify original
    d = new Date(d);
    d.setHours(0,0,0);
    // Set to nearest Thursday: current date + 4 - current day number
    // Make Sunday's day number 7
    d.setDate(d.getDate() + 4 - (d.getDay()||7));
    // Get first day of year
    var yearStart = new Date(d.getFullYear(),0,1);
    // Calculate full weeks to nearest Thursday
    var weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7)
    // Return array of year and week number
    return d.getFullYear() * 52 + (weekNo % 52);
}

function parseDate(row) {
    var ret = $.extend({}, row);
    ret.Date = getWeekNumber(Date.parse(row.Date));
    return ret;
}

function filt(row) {
    return !! cols[row.Name];
}

function sum(a, b) {
    return a + b;
}

function aggr(type) {
    return function (row, key) {
        return {
            x: parseInt(key),
            y: _.chain(row)
                .pluck(type)
                .map(parseFloat)
                .reduce(sum)
                .value()
        };
    }
}

function formatData(d) {
    var types = ['Used', 'Billable'];
    $('#raw-data').text(JSON.stringify(d, null, 2));

    return _.map(types, function(type) {
        return {
            key: type,
            values:  _.chain(d)
                      .filter(filt)
                      .map(parseDate)
                      .groupBy('Date')
                      .map(aggr(type))
                      .value()
        };
    });
}

function chart(d) {
    $('#chart-data').text(JSON.stringify(d, null, 2));
    nv.addGraph(function() {
      var chart = nv.models.lineChart();

      chart.xAxis
          .axisLabel('Time (ms)')
          .tickFormat(d3.format(',r'));

      chart.yAxis
          .axisLabel('Voltage (v)')
          .tickFormat(d3.format('.02f'));

      d3.select('#chart svg')
          .datum(d)
          .transition().duration(500)
          .call(chart);

      nv.utils.windowResize(chart.update);

      return chart;
    });
}

$(function() {
    d3.csv('history.csv',
            function(data) {
                chart(formatData(data));
            });
});
