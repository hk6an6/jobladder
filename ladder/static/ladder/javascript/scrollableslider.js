//this is a helper function, so DON'T USE IT
//size scrollbar and handle proportionally to scroll distance
function sizeScrollbar(scrollPane, scrollContent, scrollbar, handleHelper) {
	var remainder = scrollContent.width() - scrollPane.width();
	var proportion = remainder / scrollContent.width();
	var handleSize = scrollPane.width() - ( proportion * scrollPane.width() );
	scrollbar.find( ".ui-slider-handle" ).css({
											  width: handleSize,
											  "margin-left": -handleSize / 2
											  });
	handleHelper.width( "" ).width( scrollbar.width() - handleSize );
}
//this is a helper function, so DON'T USE IT
//reset slider value based on scroll content position
function resetValue(scrollPane, scrollContent, scrollbar) {
	var remainder = scrollPane.width() - scrollContent.width();
	var leftVal = scrollContent.css( "margin-left" ) === "auto" ? 0 :
	parseInt( scrollContent.css( "margin-left" ) );
	var percentage = Math.round( leftVal / remainder * 100 );
	scrollbar.slider( "value", percentage );
}
//this is a helper function, so DON'T USE IT
//if the slider is 100% and window gets larger, reveal content
function reflowContent(scrollPane, scrollContent, scrollbar) {
	var showing = scrollContent.width() + parseInt( scrollContent.css( "margin-left" ), 10 );
	var gap = scrollPane.width() - showing;
	if ( gap > 0 ) {
		scrollContent.css( "margin-left", parseInt( scrollContent.css( "margin-left" ), 10 ) + gap );
	}
}
//this is a helper function, so DON'T USE IT
//build a silder with scrollable content
function makeIntoSliderScrollBar(scrollPane, scrollContent, scrollbar){
	
	//append icon to handle
	var handleHelper = scrollbar.find( ".ui-slider-handle" )
	.mousedown(function() {
			   scrollbar.width( handleHelper.width() );
			   })
	.mouseup(function() {
			 scrollbar.width( "100%" );
			 })
	.append( "<span class='ui-icon ui-icon-grip-dotted-vertical'></span>" )
	.wrap( "<div class='ui-handle-helper-parent'></div>" ).parent();
	
	//change overflow to hidden now that slider handles the scrolling
	scrollPane.css( "overflow", "hidden" );
	
	//change handle position on window resize
	$( window ).resize(function() {
					   resetValue(scrollPane, scrollContent, scrollbar);
					   sizeScrollbar(scrollPane, scrollContent, scrollbar, handleHelper);
					   reflowContent(scrollPane, scrollContent, scrollbar);
					   });
	function safariTimeout(){
		sizeScrollbar(scrollPane, scrollContent, scrollbar, handleHelper);
	}
	//init scrollbar size
	setTimeout( safariTimeout, 10 );//safari wants a timeout
}
//provide an HTML DOM id for a div that will be turned into a scrollable slider
function setupSliderScrollBar(sliderId){
	//scrollpane parts
	var scrollPane = $( "#" + sliderId + " .scroll-pane" ),
	scrollContent = $( "#" + sliderId + " .scroll-content" );
	
	//build slider
	var scrollbar = $( "#" + sliderId + " .scroll-bar" ).slider({
		slide: function( event, ui ) {
			if ( scrollContent.width() > scrollPane.width() ) {
				scrollContent.css( "margin-left", Math.round(ui.value / 100 * ( scrollPane.width() - scrollContent.width() )) + "px" );
			} else {
				scrollContent.css( "margin-left", 0 );
			}
		}
	});
	
	var elements = $('#' + sliderId + ' .scroll-content .scroll-content-item').length
	var container_width = (elements+1) * ($('#' + sliderId + ' .scroll-content .scroll-content-item').width()+20)
	$('#' + sliderId + ' .scroll-content').css('width',container_width);
	
	makeIntoSliderScrollBar(scrollPane, scrollContent, scrollbar);
}
