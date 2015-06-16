/*!
 * Sumo Datepicker
 * http://sumofy.me/
 *
 * Copyright Think Sumo Creative Media Inc.
 * Developed by Developed by Derrick Nicolas and Rupert Cabrera
 * Released under the MIT license.
 * http://sumofy.me/
 *
 */
(function($) {
    $.fn.sumodate = function(options) {
        var defaults = {  
            monthFormat: 'mmm', // m – One-digit month,mm – Two-digit month,mmm – Three-letter abbreviation for month, mmmm – Month spelled out in full, e.g. April
            dayFormat: 'dd', //d – One-digit day for days below 10, dd – Two-digit day
           // yearFormat: 'yyyy', //yy – Two-digit year,yyyy – Four-digit year
            maxYear: '2099',//year or current
            minYear:'1990' //year or current
            };  
        
        var inputDate = $(this).val();

        //Extend those options
        var options = $.extend(defaults, options); 

        return this.each(function() {

			var elem = $(this); //element

			// elem.val(options.monthFormat);
			var d = new Date();
			var date = $(this);
			var input = {};
			
			input.name = date.attr('name');
			input.val = date.val();
			input.random = Math.floor(Math.random() * 1000000000000);
			input.id = 'drop_date-' + input.random;

			//formatting of months
			 var fullMonth = [ "January", "February", "March", "April", "May", "June",
		    "July", "August", "September", "October", "November", "December" ];

			var shortMonth = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun",
		    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];

		    var numWithLeadMonth= ["01","02","03","04","05","06","07","08","09","10","11","12"];
		    var numMonth= ["1","2","3","4","5","6","7","8","9","10","11","12"];

			 var mFormat = fullMonth;
			 if (options.monthFormat == 'mm') {
				mFormat = numWithLeadMonth;
			}
			else if (options.monthFormat == 'mmmm') {
				mFormat = fullMonth;
			}
			else if (options.monthFormat == 'm') {
				mFormat = numMonth;
			}
			else {
				mFormat = shortMonth;
			}


			var html = '<div class="dropdownDatepickerGroup">';
			html += '<input type="hidden" name="'+input.name+'" id="'+input.id+'" value="' + elem.val() + '">';
			html += '<select name="drop_month-'+input.random+'" id="drop_month-'+input.random+'" class="drop_month">'+
				'<option value="" disabled>Month</option>'+
				'<option value="01">'+ mFormat[0] +'</option>'+
				'<option value="02">'+ mFormat[1] +'</option>'+
				'<option value="03">'+ mFormat[2] +'</option>'+
				'<option value="04">'+ mFormat[3] +'</option>'+
				'<option value="05">'+ mFormat[4] +'</option>'+
				'<option value="06">'+ mFormat[5] +'</option>'+
				'<option value="07">'+ mFormat[6] +'</option>'+
				'<option value="08">'+ mFormat[7] +'</option>'+
				'<option value="09">'+ mFormat[8] +'</option>'+
				'<option value="10">'+ mFormat[9] +'</option>'+
				'<option value="11">'+ mFormat[10] +'</option>'+
				'<option value="12">'+ mFormat[11] +'</option>'+
				'</select>';

			//formatting of days
			//formatting of day not yet done
			html += '<select name="drop_day-'+input.random+'" id="drop_day-'+input.random+'" class="drop_day">'+
				'<option value="" disabled>Day</option>';
				if (options.dayFormat == 'dd') {
					for (i = 1; i <= 31; i++) { 
					  html += '<option value="'+ i +'">'+ pad(i) +'</option>';
					}
				} else {
					for (i = 1; i <= 31; i++) { 
					  html += '<option value="'+ i +'">'+ i +'</option>';
					}
				}
			
			html +='</select>';

		//formatting of year
		var latestYear = options.minYear;
		var lastYear = options.maxYear;
		if (options.maxYear == 'current') {
		
			lastYear = d.getFullYear();
		}
		if (options.minYear == 'current') {
			latestYear = d.getFullYear();
		}
		if(date.is('[data-add-year]')){
			latestYear += date.data('add-year');
		}

		html += '<select name="drop_year-'+input.random+'" id="drop_year-'+input.random+'" class="drop_year"><option value="" disabled>Year</option>';
		if (options.yearFormat == 'yy') {
			for (i=latestYear; i <= lastYear; i++) {
				x = i.toString().slice(2,4);
				html += '<option value="'+i+'">'+ x  +'</option>';
			}
		}
		else {
			for (i=latestYear; i <= lastYear; i++) {
				html += '<option value="'+i+'">'+ i  +'</option>';
			}
		} 

		html += '</select>';
		html += '</div>';
		$(html).insertAfter(date);

		if (date.data('no-date') == true) {
			$('#drop_day-'+input.random).val('01');
			$('#drop_day-'+input.random).addClass('hide');
		}

		if (inputDate != '') {
			var dateVal = new Date(inputDate);
			$('#drop_month-'+input.random).val(pad(dateVal.getMonth() + 1));
			$('#drop_day-'+input.random).val(dateVal.getDate());
			$('#drop_year-'+input.random).val(dateVal.getFullYear());
		}
		date.remove();
	});

		function pad(number) {
			return (number < 10 ? '0' : '') + number;
		}
    }

})(jQuery);

$( document).on('change','.drop_month, .drop_day, .drop_year', function() {
	var dropdown = $(this);
	var group = $(this).closest('.dropdownDatepickerGroup');
	var input = group.find('input[type="hidden"]');
	var year = group.find('.drop_year').val();
	var month = group.find('.drop_month').val();
	var day = group.find('.drop_day').val();

	if ((year != 0) && (month!=0)) {
		var lastday = 32 - new Date(year, month - 1, 32).getDate();
		var selected_day = group.find('.drop_day').val();

		if (selected_day > lastday) {
			group.find('.drop_day > option[value=' + selected_day + ']').attr('selected', false);
			group.find('.drop_day > option[value=' + lastday + ']').attr('selected', true);
		}

		for (var i = lastday + 1; i < 32; i++) {
			group.find('.drop_day > option[value=' + i + ']').remove();	
		}

		for (var i = 29; i < lastday + 1; i++) {
			if (!group.find('.drop_day > option[value=' + i + ']').length) {
				group.find('.drop_day').append($("<option></option>").attr("value",i).text(i));
			} 
		}

		if (day != 0) {
			input.val(year+'-'+month+'-'+day);
		}
	}
});