//alert('Hi');
$(document).ready(function(){
    alert('Hi');
    $('.delete-article').on('click', function(e){
      $target = $(e.target);
      const id = $target.attr('data-id');
      $.ajax({
        type:'DELETE',
        url: '/articles/'+id,
        success: function(response){
          alert('Deleting Article');
          window.location.href='/';
        },
        error: function(err){
          console.log(err);
        }
      });
    });
  });