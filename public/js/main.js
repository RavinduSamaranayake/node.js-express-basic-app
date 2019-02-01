$(document).ready(function(){
    $('.delete-article').on('click',function(e){
        $target = $(e.target);
        const id = $target.attr('data-id');
        $.ajax({
            type: 'DELETE',
            url: '/article/'+id,
            success: function(responce){
                alert('Deleting Article');
                window.location.href='/';
            },
            error: function(err){
                console.log(err);
            }
        })
    })
})