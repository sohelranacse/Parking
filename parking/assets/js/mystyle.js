var li=links(); //global declare


$( function() {
  $( "#slider-range" ).slider({
    range: "min",
    value: 1,
    min: 1,
    max: 50,
    slide: function( event, ui ) {
      $( "#amount" ).val(ui.value );
    }
  });
  $( "#amount" ).val($( "#slider-range" ).slider( "value" ) );
});



$( function() {
  $( "#from_date" ).datepicker({ minDate: 0, dateFormat: 'yy-mm-dd'});
  $( "#b_date" ).datepicker({ dateFormat: 'yy-mm-dd'});
  $( "#to_date" ).datepicker({ minDate: 0, dateFormat: 'yy-mm-dd'});
} );

var dateToday = new Date();
var dates = $("#from, #to").datepicker({
    defaultDate: "+1w",
    changeMonth: true,
    format: 'YYYY-MM-DD',
    numberOfMonths: 1,
    dateFormat: 'yy-mm-dd',
    minDate: dateToday,

    onSelect: function(selectedDate) {
      var option = this.id == "from" ? "minDate" : "maxDate",
      instance = $(this).data("datepicker"),
      date = $.datepicker.parseDate(instance.settings.dateFormat || $.datepicker._defaults.dateFormat, selectedDate, instance.settings);
      dates.not(this).datepicker("option", "showAnim", 'slide');
    }
});
$( "#from, #to" ).datepicker( "option", "showAnim", 'slide');

$("#location_input").keyup(function(){
      
    var v=$("#location_input").val();
  
    if(v != ''){
    
      $('#location_input').addClass('ac_loading');        
          
      $("#location_input").autocomplete({
          source: function( request, response ) {
      
          $.ajax({
        
            type:'POST',
            dataType:'json',
            url:li+'home/autocomplete_view',
            data:{id:v},
            success:function(data)
            {
                response(data);
            }
            
          });         
            
          $("#location_input").removeClass('ac_loading');

        }   
      
      });
    }
});



// PARKING NOW MAIN SEARCH BUTTON
$("#location_search").on('submit',function (e){
  var input_data = $('#location_input').val().trim();
  var from = $('#from').val().trim();

  if (input_data=='' && from=='') {
    alert('Information incomplete.');
  }else{

    $.ajax({
      type: 'POST',
      url:li+'home/location_data',
      data:{input_data:input_data,from:from},
      dataType:'json',
      success: function(data){

        if(data.final==false){
          alert('No place found.');
        }else{
          var datas = data.final;
          var i;
          var full_data='';
          for(i=0; i<datas.length;i++){
            var location = datas[i].location;
            var amount = datas[i].amount;
            var id = datas[i].id;
            var title = datas[i].title;
            var title_link= title.toLowerCase();

            var rv_types = datas[i].rv_types;
            var rv_sizes = datas[i].rv_sizes;

            var to_date = datas[i].to_date;
            var book = datas[i].book;
            if (book==1) {
              var book_now = '<a href="'+li+'home/host_rv/'+id+'/'+title.split(' ').join('-')+'" target="_blank" class="btn btn-book-now">Book now</a>';
            }else{
              var book_now = '';
            }

            full_data +=
              '<div class="listing mob-space30 space30">'+
                  '<div class="col-md-2 pad0 hidden-xs col-sm-2">'+
                    '<div class="listing-img bg-image" style="background: rgba(0, 0, 0, 0) url('+li+'assets/images/icons/placeholder-parking.png) no-repeat ;">'+
                        '<div class="li-overlay">'+
                          '<div class="li-overlay-inner">'+
                            '<a href="'+li+'home/host_rv/'+id+'/'+title.split(' ').join('-')+'" target="_blank" class="link"></a>'+
                          '</div>'+
                        '</div>'+
                    '</div>'+
                  '</div>'+
                  '<div class="col-md-10 pad0 col-sm-10">'+
                    '<div class="listing-info">'+
                      '<div class="col-md-8 col-sm-8 col-xs-8 pad0">'+
                        '<h4 class="li-name"><a href="'+li+'home/host_rv/'+id+'/'+title.split(' ').join('-')+'" target="_blank">'+title+'</a></h4>'+
                        '<ul class="list-icon">'+
                          '<li> <i class="fa fa-map-marker"></i> '+location+'</li>'+
                        '</ul>'+
                        '<ul class="list-review-icon">'+
                            '<li><i class="fa fa-star"></i></li>'+
                            '<li><i class="fa fa-star"></i></li>'+
                            '<li><i class="fa fa-star"></i></li>'+
                            '<li><i class="fa fa-star"></i></li>'+
                            '<li><i class="fa fa-star"></i></li>'+
                        '</ul>'+
                      '</div>'+
                      '<div class="col-md-4 col-sm-4 col-xs-4 text-right">'+
                        '<h4 class="btn btn-default" disable><i class="fa fa-usd"></i>'+amount+'</h4>'+book_now+
                      '</div>'+
                    '</div>'+
                  '</div>'+
              '</div>';

            $("#filterig_result").html(full_data);
            $("#current_location").html('Total places: '+datas.length);

          
            geocoder = new google.maps.Geocoder();
            var mapOptions = 
            {
              zoom: 10,gestureHandling: 'greedy'
            }
            map = new google.maps.Map(document.getElementById('maps'), mapOptions);
            codeAddress(location,amount,id,title);//call the function

            //full_module(location,amount,id,title,email,phone_number);//call the function

          }
          listing_pagination(); //pagination listing

        }
        
      },
      error: function(){
        alert('error..!');
      }
    });

  }
  e.preventDefault();
});

function codeAddress(address,amount,id,title) {
  geocoder.geocode( {address:address}, function(results, status) 
  {
    if (status == google.maps.GeocoderStatus.OK){
      map.setCenter(results[0].geometry.location);//center the map over the result
      //place a marker at the location
      var marker = new google.maps.InfoWindow({
        map: map,
        position: results[0].geometry.location,
        zoom: 16,

        content: '<a class="map_info_style" href="'+li+'home/host_rv/'+id+'/'+title.split(' ').join('-')+'" target="_blank"><i class="fa fa-usd"></i>'+amount+'</a>'
      });
    }
  });
}
// PARKING NOW MAIN SEARCH WORK END





/* /MY WORKING 14 FEB/ */
function find_disallow_location_result(){
  $.ajax({
    type: 'POST',
    url:li+'home/find_disallow_location_result',
    dataType:'json',
    success: function(data){

      if(data.final==false){
        $("#filterig_result").html("<p>No data found.</p>");
      }else{
        var datas = data.final;
        var i;
        var full_data='';
        for(i=0; i<datas.length;i++){
          var location = datas[i].location;
          var amount = datas[i].amount;
          var id = datas[i].id;
          var title = datas[i].title;

          var rv_types = datas[i].rv_types;
          var rv_sizes = datas[i].rv_sizes;

          var to_date = datas[i].to_date;
          var book = datas[i].book;
          if (book==1) {
              var book_now = '<a href="'+li+'home/host_rv/'+id+'/'+title.split(' ').join('-')+'" target="_blank" class="btn btn-book-now">Book now</a>';
          }else{
            var book_now = '';
          }

          full_data +=
            '<div class="listing mob-space30 space30">'+
                '<div class="col-md-2 pad0 hidden-xs col-sm-2">'+
                  '<div class="listing-img bg-image" style="background: rgba(0, 0, 0, 0) url('+li+'assets/images/icons/placeholder-parking.png) no-repeat ;">'+
                      '<div class="li-overlay">'+
                        '<div class="li-overlay-inner">'+
                          '<a href="'+li+'home/host_rv/'+id+'/'+title.split(' ').join('-')+'" target="_blank" class="link"></a>'+
                        '</div>'+
                      '</div>'+
                  '</div>'+
                '</div>'+
                '<div class="col-md-10 pad0 col-sm-10">'+
                  '<div class="listing-info">'+
                    '<div class="col-md-8 col-sm-8 col-xs-8 pad0">'+
                      '<h4 class="li-name"><a href="'+li+'home/host_rv/'+id+'/'+title.split(' ').join('-')+'" target="_blank">'+title+'</a></h4>'+
                      '<ul class="list-icon">'+
                        '<li> <i class="fa fa-map-marker"></i> '+location+'</li>'+
                      '</ul>'+
                      '<ul class="list-review-icon">'+
                          '<li><i class="fa fa-star"></i></li>'+
                          '<li><i class="fa fa-star"></i></li>'+
                          '<li><i class="fa fa-star"></i></li>'+
                          '<li><i class="fa fa-star"></i></li>'+
                          '<li><i class="fa fa-star"></i></li>'+
                      '</ul>'+
                    '</div>'+
                    '<div class="col-md-4 col-sm-4 col-xs-4 text-right">'+
                      '<h4 class="btn btn-default" disable><i class="fa fa-usd"></i>'+amount+'</h4>'+book_now+
                    '</div>'+
                  '</div>'+
                '</div>'+
            '</div>';

        $("#filterig_result").html(full_data);
        $("#current_location").html('Total places: '+datas.length);


               
        

        
          geocoder = new google.maps.Geocoder();
          var mapOptions = 
          {
            zoom: 10,gestureHandling: 'greedy'
          }
          map = new google.maps.Map(document.getElementById('maps'), mapOptions);
          codeAddress(location,amount,id,title);//call the function

          //full_module(location,amount,id,title,email,phone_number);//call the function

        }// for end

        listing_pagination(); //pagination listing
        

      } //else end
      
    },
    error: function(){
      alert('error..!');
    }
  });
}


function listing_pagination(){
  var monkeyList = new List('test-list', {
    valueNames: ['listing'],
    page: 3,
    pagination: true
  });
} //LISTING PAGINATION


function showpos(city,lat,lng){

  var city_name = city;


  $.ajax({
      type: 'POST',
      url:li+'home/location_data_current',
      data:{city_name:city_name},
      dataType:'json',
      success: function(data){

        if(data.final==false){
          $("#filterig_result").html("<p>No data found.</p>");
        }else{
          var datas = data.final;
          var i;
          var full_data='';
          for(i=0; i<datas.length;i++){
            var location = datas[i].location;
            var amount = datas[i].amount;
            var id = datas[i].id;
            var title = datas[i].title;
            var title_link= title.toLowerCase();

            var rv_types = datas[i].rv_types;
            var rv_sizes = datas[i].rv_sizes;

            var to_date = datas[i].to_date;
            var book = datas[i].book;
            if (book==1) {
              var book_now = '<a href="'+li+'home/host_rv/'+id+'/'+title.split(' ').join('-')+'" target="_blank" class="btn btn-book-now">Book now</a>';
            }else{
              var book_now = '';
            }

            full_data +=
              '<div class="listing mob-space30 space30">'+
                  '<div class="col-md-2 pad0 hidden-xs col-sm-2">'+
                    '<div class="listing-img bg-image" style="background: rgba(0, 0, 0, 0) url('+li+'assets/images/icons/placeholder-parking.png) no-repeat ;">'+
                        '<div class="li-overlay">'+
                          '<div class="li-overlay-inner">'+
                            '<a href="'+li+'home/host_rv/'+id+'/'+title.split(' ').join('-')+'" target="_blank" class="link"></a>'+
                          '</div>'+
                        '</div>'+
                    '</div>'+
                  '</div>'+
                  '<div class="col-md-10 pad0 col-sm-10">'+
                    '<div class="listing-info">'+
                      '<div class="col-md-8 col-sm-8 col-xs-8 pad0">'+
                        '<h4 class="li-name"><a href="'+li+'home/host_rv/'+id+'/'+title.split(' ').join('-')+'" target="_blank">'+title+'</a></h4>'+
                        '<ul class="list-icon">'+
                          '<li> <i class="fa fa-map-marker"></i> '+location+'</li>'+
                        '</ul>'+
                        '<ul class="list-review-icon">'+
                            '<li><i class="fa fa-star"></i></li>'+
                            '<li><i class="fa fa-star"></i></li>'+
                            '<li><i class="fa fa-star"></i></li>'+
                            '<li><i class="fa fa-star"></i></li>'+
                            '<li><i class="fa fa-star"></i></li>'+
                        '</ul>'+
                      '</div>'+
                      '<div class="col-md-4 col-sm-4 col-xs-4 text-right">'+
                        '<h4 class="btn btn-default" disable><i class="fa fa-usd"></i>'+amount+'</h4>'+book_now+
                      '</div>'+
                    '</div>'+
                  '</div>'+
              '</div>';

            $("#filterig_result").html(full_data);
            $("#current_location").html('Total places: '+datas.length);

          
            geocoder = new google.maps.Geocoder();
            var mapOptions = 
            {
              zoom: 12,
              gestureHandling: 'greedy'
            }
            map = new google.maps.Map(document.getElementById('maps'), mapOptions);
            codeAddress_current(location,amount,id,title,lat,lng);//call the function
          } //for end

          listing_pagination(); //pagination listing

        }
      },
      error: function(){
        alert('error..!');
      }
    });
}








$("#con_pass").blur(function(){
  var pass_up = $("#pass_up").val().trim();
  var con_pass = $("#con_pass").val().trim();


  if (pass_up == con_pass) {
    $("#match_result").html('');
  }else{
    $("#match_result").html('Password did not match');
  }
});

function initMap() {
  $("#search_state").geocomplete({
   types: ['geocode'],
   country: 'us'
  });

  $("#search_city").geocomplete({
   types: ['geocode'],
   country: 'us'
  });

  $("#search_borough").geocomplete({
   types: ['geocode'],
   country: 'us'
  });

  $("#search_location").geocomplete({
   types: ['establishment'],
   country: 'us'
  });

}

/*
function initialize_search() {
  var search_country = document.getElementById('search_country');
  var autocomplete = new google.maps.places.Autocomplete(search_country);
}
google.maps.event.addDomListener(window, 'load', initialize_search);
*/


//host images deleted
function host_image_delete(value){
  var all_id = $(value).val().trim();
  var res = all_id.split(":");
  var id = res[0];

  var del = confirm('Are you sure want to delete!');
  if (del == 1) {
    $.ajax({
      type: 'POST',
      url:li+'user/host_image_delete',
      data:{all_id:all_id},
      dataType:'json',
      success: function(response){
        //$("#"+all_id+"del").hide();
        $('#sohels'+id).fadeOut();
        alert(response);
      },
      error: function(){
        alert('error');
      }
    });
  }
}

function password_change(){
  var old_pass = $("#old_pass").val().trim();
  var new_pass = $("#new_pass").val().trim();
  var confirm_pass = $("#confirm_pass").val().trim();

  if (new_pass !== '' && old_pass !== '' && confirm_pass !== '') {
    if (new_pass == confirm_pass) {
      $.ajax({
        type: 'POST',
        url:li+'admin/password_change',
        data:{old_pass:old_pass,new_pass:new_pass,confirm_pass:confirm_pass},
        dataType:'json',
        success: function(response){

          $("#old_pass").val('');
          $("#new_pass").val('');
          $("#confirm_pass").val('');

          if (response['success']) {
            $("#show_change_pass").html(response['success']);
          }else if(response['mismatch']){
            $("#show_change_pass").html(response['mismatch']);
          }else{;
            $("#show_change_pass").html(response['try_new']);
          }

        },
        error: function(){
          alert('error');
        }
      });
    }else{
      $("#show_change_pass").html('Confirm pass did not match.');
    }
    
  }else{
    $("#show_change_pass").html('Information incomplete.');
  }


}



//park

function park_now(){
  var id = $('#host_id').val().trim();
  var m_id = $('#m_id').val().trim();
  var c_id = $('#c_id').val().trim();
  var from_date = $('#from').val().trim();
  var to_date = $('#to').val().trim();

  if (to_date == from_date) {
    $('#show_payment_status').html('Please changed the date!');
  }else{

    if (to_date !== '' && from_date !== '' && id !== '' && m_id !== '' && c_id !== '') {
      $.ajax({
        type: 'POST',
        url:li+'user/park_now',
        data:{to_date:to_date,from_date:from_date,id:id,m_id:m_id,c_id:c_id},
        dataType:'json',
        success: function(response){

          if (response==1) {
            window.location.href=li+"user/booking/"+id+"/"+from_date+"/"+m_id+"/"+to_date;
          }else if(response==3){
            $('#show_payment_status').html('You can not apply!');
          }else{
            $('#show_payment_status').html('Date selected invalid!');
          }
          

        },
        error: function(){
          alert('error host');
        }
      });
    }
  }
}


//review submit
function review_submit(){
  var rating = $("#rating").val().trim();
  var title = $("#title").val().trim();
  var comments = $("#comments").val().trim();
  var hostid = $("#hostid").val().trim();
  var userid = $("#userid").val().trim();



  if(rating == 0 || comments == ''|| title == ''){
    alert('Please provide a rating.');
  }else{
    $.ajax({
      type: 'POST',
      url:li+'user/review_submit',
      data:{rating:rating,comments:comments,hostid:hostid,userid,userid,title,title},
      dataType:'json',
      success: function(response){

        if (response==3) {
          alert('Please remove previous review, then try again.');
        }
        else if (response==2) {
          alert('Review did not added!');
        }else if (response==1){
          location.reload();
        }

      },
      error: function(){
        alert('error review..!');
      }
    });
  }
}

$("#auto_email").keyup(function(){
      
    var v=$("#auto_email").val();
  
    if(v != ''){
    
      $('#auto_email').addClass('ac_loading');        
          
      $("#auto_email").autocomplete({
          source: function( request, response ) {
      
          $.ajax({
        
            type:'POST',
            dataType:'json',
            url:li+'user/autocomplete_view_email',
            data:{id:v},
            success:function(data)
            {
                response(data);
            }
            
          });         
            
          $("#auto_email").removeClass('ac_loading');

        }   
      
      });
    }
});
function request_inbox(){
  var email = $("#auto_email").val().trim();

  if (email=='') {alert('Information incomplete');}else{
    $.ajax({
      type:'POST',
      dataType:'json',
      url:li+'user/request_inbox/',
      data:{email:email},
      success:function(data)
      {
          $("#auto_email").val(' ');
          if(data.failed==2){
            alert('Request Failed');
          }else if(data.old==3){
            alert('Already Added.');
            $("#auto_email").focus();
          }else{
            location.reload();
          }
      }
      
    });
  }
}

function reply_inbox(value){
  var all_val = $(value).val().trim();

  $.ajax({
        type: 'POST',
        url:li+'user/reply_inbox/',
        data:{all_val:all_val},
        dataType:'json',
        success: function(data){

          $("#send_button").val(all_val);
          
          $("#message_body").focus();

          if (data.final==2) {
            $("#conversation_start").html('Please, start conversation.');
            
          }else{

            var datas = data.final;

            var full_data='';
            for(i=0; i<datas.length;i++){
              var id = datas[i].id;

              var id1 = datas[i].id1;
              var id2 = datas[i].id2;

              var details = datas[i].details;
              var added_date = datas[i].added_date;
              var type = datas[i].type;

              var fname = datas[i].fname;


              if (type==0) {
                full_data += '<div class="mmg_extra">'+
                '<h4>Admin</h4>'+
                '<p>'+details+'</p>'+
                '<span>'+added_date+'</span>'+
              '</div>';
              }else if (type==id2) {
                full_data += '<div class="mmg_extra">'+
                '<h4>Self</h4>'+
                '<p>'+details+'</p>'+
                '<span>'+added_date+'</span>'+
              '</div>';
              }else if (type==id1) {
                full_data += '<div class="mmg">'+
                '<h4>'+fname+'</h4>'+
                '<p>'+details+'</p>'+
                '<span>'+added_date+'</span>'+
              '</div>';
              }

            }

            $("#conversation_start").html(full_data);

          }
          
        },
        error: function(){
          alert('Error user control!');
        }
    });

}
function submit_messege(value){
  var all_val = $(value).val().trim();
  var details = $("#message_body").val().trim();

  if (all_val=='' || details=='') {
    alert('Write something...')
  }else{

    $.ajax({
          type: 'POST',
          url:li+'user/submit_messege/',
          data:{all_val:all_val,details:details},
          dataType:'json',
          success: function(data){


            $("#message_body").val(' ');
            $("#message_body").focus();

          var datas = data.final;

          var full_data='';
            for(i=0; i<datas.length;i++){
              var id = datas[i].id;

              var id1 = datas[i].id1;
              var id2 = datas[i].id2;

              var details = datas[i].details;
              var added_date = datas[i].added_date;
              var type = datas[i].type;

              var fname = datas[i].fname;


              if (type==0) {
                full_data += '<div class="mmg_extra">'+
                '<h4>Admin</h4>'+
                '<p>'+details+'</p>'+
                '<span>'+added_date+'</span>'+
              '</div>';
              }else if (type==id2) {
                full_data += '<div class="mmg_extra">'+
                '<h4>Self</h4>'+
                '<p>'+details+'</p>'+
                '<span>'+added_date+'</span>'+
              '</div>';
              }else if (type==id1) {
                full_data += '<div class="mmg">'+
                '<h4>'+fname+'</h4>'+
                '<p>'+details+'</p>'+
                '<span>'+added_date+'</span>'+
              '</div>';
              }

            }

            $("#conversation_start").html(full_data);



          },
          error: function(){
            alert('Error inbox!');
          }
      });
  }
}


function hosting_delete(value){
  var val = $(value).val().trim();

  var del = confirm('Are you sure want to delete!');
  if (del == 1) {
    $.ajax({
      type: 'POST',
      url:li+'user/hosting_delete',
      data:{val:val},
      dataType:'json',
      success: function(response){
        if (response==1) {
          $('#sohel'+val).fadeOut();
          alert('Successfully deleted.');
        }else if (response==2) {
          alert("Delete Failed!");
        }
        
        
      },
      error: function(){
        alert('error delete');
      }
    });
  }
}

function confirm_chat_with_admin(value){
  var all_val = $(value).val().trim();

  $.ajax({
        type: 'POST',
        url:li+'user/confirm_chat_with_admin/',
        data:{all_val:all_val},
        dataType:'json',
        success: function(data){

          if (data == 1) {
            location.reload();
          }
          
        },
        error: function(){
          alert('Error user control!');
        }
    });

}




//by sender
function reply_inbox_sender(value){
  var all_val = $(value).val().trim();

  $.ajax({
        type: 'POST',
        url:li+'user/reply_inbox_sender/',
        data:{all_val:all_val},
        dataType:'json',
        success: function(data){

          $("#send_button2").val(all_val);
          
          $("#message_body2").focus();

          if (data.final==2) {
            $("#conversation_start2").html('Please, start conversation.');
            
          }else{

            var datas = data.final;

            var full_data='';
            for(i=0; i<datas.length;i++){
              var id = datas[i].id;

              var id1 = datas[i].id1;
              var id2 = datas[i].id2;

              var details = datas[i].details;
              var added_date = datas[i].added_date;
              var type = datas[i].type;

              var fname = datas[i].fname;


              if (type==0) {
                full_data += '<div class="mmg_extra">'+
                '<h4>Admin</h4>'+
                '<p>'+details+'</p>'+
                '<span>'+added_date+'</span>'+
              '</div>';
              }else if (type==id1) {
                full_data += '<div class="mmg_extra">'+
                '<h4>Self</h4>'+
                '<p>'+details+'</p>'+
                '<span>'+added_date+'</span>'+
              '</div>';
              }else if (type==id2) {
                full_data += '<div class="mmg">'+
                '<h4>'+fname+'</h4>'+
                '<p>'+details+'</p>'+
                '<span>'+added_date+'</span>'+
              '</div>';
              }

            }

            $("#conversation_start2").html(full_data);

          }
          
        },
        error: function(){
          alert('Error user control!');
        }
    });

}
function submit_messege_sender(value){
  var all_val = $(value).val().trim();
  var details = $("#message_body2").val().trim();

  if (all_val=='' || details=='') {
    alert('write something...')
  }else{

    $.ajax({
          type: 'POST',
          url:li+'user/submit_messege_sender/',
          data:{all_val:all_val,details:details},
          dataType:'json',
          success: function(data){


            $("#message_body2").val(' ');
            $("#message_body2").focus();

          var datas = data.final;

          var full_data='';
            for(i=0; i<datas.length;i++){
              var id = datas[i].id;

              var id1 = datas[i].id1;
              var id2 = datas[i].id2;

              var details = datas[i].details;
              var added_date = datas[i].added_date;
              var type = datas[i].type;

              var fname = datas[i].fname;


              if (type==0) {
                full_data += '<div class="mmg_extra">'+
                '<h4>Admin</h4>'+
                '<p>'+details+'</p>'+
                '<span>'+added_date+'</span>'+
              '</div>';
              }else if (type==id1) {
                full_data += '<div class="mmg_extra">'+
                '<h4>Self</h4>'+
                '<p>'+details+'</p>'+
                '<span>'+added_date+'</span>'+
              '</div>';
              }else if (type==id2) {
                full_data += '<div class="mmg">'+
                '<h4>'+fname+'</h4>'+
                '<p>'+details+'</p>'+
                '<span>'+added_date+'</span>'+
              '</div>';
              }

            }

            $("#conversation_start2").html(full_data);



          },
          error: function(){
            alert('Error inbox!');
          }
      });
  }
}
function confirm_chat_with_this_user(value){
  var all_val = $(value).val().trim();

  $.ajax({
        type: 'POST',
        url:li+'user/confirm_chat_with_this_user/',
        data:{all_val:all_val},
        dataType:'json',
        success: function(data){

          if (data == 1) {
            location.reload();
          }
          
        },
        error: function(){
          alert('Error user control!');
        }
    });

}

function edit_hosting(value){
  var id = $(value).val().trim();

  if (id !== '') {
    $.ajax({
      type: 'POST',
      url:li+'user/edit_hosting',
      data:{id:id},
      dataType:'json',
      success: function(response){
        if (response == 1) {
          window.location.href=li+"user/become_a_host_location/"+id;
        }else{
          location.reload();
        }
        
      },
      error: function(){
        alert('Error editing..');
      }
    });
  }
}


function amount_withdraw(){
  var amount = $("#amount_withdraw").val().trim();
  if (amount == '') {
    alert('Put on amount.');
  }else{
      $.ajax({
          type: 'POST',
          url:li+'user/amount_withdraw/',
          data:{amount:amount},
          dataType:'json',
          success: function(data){

            if (data == 1) {
              alert('Withdraw review successful.');
              location.reload();
            }else{
              alert('Withdraw error.');
            }
            
          },
          error: function(){
            alert('Error payment!');
          }
      });

  }

}
function remove_review(value){
  var all_id = $(value).val().trim();

  var del = confirm('Are you sure want to delete review?');
  if (del == 1) {
    $.ajax({
      type: 'POST',
      url:li+'user/remove_review',
      data:{all_id:all_id},
      dataType:'json',
      success: function(response){
        if (response == 1) {
          $('#review'+all_id).fadeOut();
          alert("Deleted successfully.");
        }
        
      },
      error: function(){
        alert('error');
      }
    });
  }
}


/*PARKING*/

function codeAddress_current(address,amount,id,title,lat,lng) {
  geocoder.geocode( {address:address}, function(results, status) 
  {
    if (status == google.maps.GeocoderStatus.OK){
      map.setCenter(results[0].geometry.location);//center the map over the result
      //place a marker at the location
      //for marker locaton
      var uluru = {lat: lat, lng: lng}
      var marker2 = new google.maps.Marker({
        map: map,
        position: uluru,
        icon: li+'assets/images/marker.png'
      });

      var marker = new google.maps.InfoWindow({
        map: map,
        position: results[0].geometry.location,

        content: '<a class="map_info_style" href="'+li+'home/host_rv/'+id+'/'+title.split(' ').join('-')+'" target="_blank"><i class="fa fa-usd"></i>'+amount+'</a>'
      });

    }
  });
}

function handCash_booking(){
  var hostid = $("#hostid").val().trim();
  var m_id = $("#m_id").val().trim();
  var from_date = $("#from_date").val().trim();
  var to_date = $("#to_date").val().trim();
  var rv_types = $("#rv_types").val().trim();

  if (hostid !== '' && m_id !== '' && from_date !== '' && to_date !== ' '&& rv_types !== '') {
    $.ajax({
      type: 'POST',
      url:li+'user/booking_handcash',
      data:{hostid:hostid,m_id:m_id,from_date:from_date,to_date:to_date,rv_types:rv_types},
      dataType:'json',
      success: function(response){
        
        if (response == 1) {
          window.location.href=li+'user/booking_overview';
        }
        
      },
      error: function(){
        alert('error booking.');
      }
    });
  }
}
//PASSWORD CHANGE USER PANEL
function password_change(){
  var old_pass = $("#old_pass").val().trim();
  var new_pass = $("#new_pass").val().trim();
  var confirm_pass = $("#confirm_pass").val().trim();

  if (new_pass !== '' && old_pass !== '' && confirm_pass !== '') {
    if (new_pass == confirm_pass) {
      $.ajax({
        type: 'POST',
        url:li+'user/password_change',
        data:{old_pass:old_pass,new_pass:new_pass,confirm_pass:confirm_pass},
        dataType:'json',
        success: function(response){

          $("#old_pass").val('');
          $("#new_pass").val('');
          $("#confirm_pass").val('');

          if (response['success']) {
            $("#show_change_pass").html(response['success']);
          }else if(response['mismatch']){
            $("#show_change_pass").html(response['mismatch']);
          }else{;
            $("#show_change_pass").html(response['try_new']);
          }

        },
        error: function(){
          alert('error');
        }
      });
    }else{
      $("#show_change_pass").html('Confirm pass did not match.');
    }
    
  }else{
    $("#show_change_pass").html('Information incomplete.');
  }


}

function admin_search_user(val){
  var user_mail = $(val).val().trim();
  if (user_mail !== '') {
    $.ajax({
      type: 'POST',
      url:li+'user/admin_search_user',
      data:{user_mail:user_mail},
      dataType:'json',
      success: function(data){

        if(data.final == false){
          $("#total_user_result").html('<p>No user found.</p>');
        }else{
          var datas = data.final;
          var i;
          var full_data='';
          for(i=0; i<datas.length;i++){
            var id = datas[i].id;
            var user = datas[i].user;
            var password = datas[i].password;
            var email = datas[i].email;
            var phone = datas[i].phone;
            

            full_data +=
                '<tr>'+
                  '<td>'+id+'</td>'+
                  '<td><a href="'+li+'user/make_user/'+id+'">'+user+'</a></td>'+
                  '<td>'+password+'</td>'+
                  '<td>'+email+'</td>'+
                  '<td>'+phone+'</td>'+
                '</tr>';

          $("#total_user_result").html(full_data);
          }
        }

      },
      error: function(){
        alert('error');
      }
    });
  }
}