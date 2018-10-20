$('.save').on('click', event => {
  let id = $(event.target).data('id');
  $.ajax({
      method: 'POST',
      url: '/articles/' + id,
  }).then(() => {
      location.reload();
  });
});

$('.comment').on('click', event => {
  $('#commentModal').modal('show');
  let id = $(event.target).data('id');
  $.ajax({
      method: 'GET',
      url: '/saved/' + id
  })
  .then(data => {
      $(".modal-title").html(data.title);
      $(".modal-footer").append("#submit");
      console.log(data.comment);
      
  });
});

$('#commentModal').on('click', '#submit', event => {
  event.preventDefault();
  console.log('Clicked');
  let id = $(event.target).data('id');
  $.ajax({
      method: 'POST',
      url: '/saved/' + id,
      data: {
        title: $('#title').val().trim(),
        body: $('#body').val().trim()
      }
  }).then(() => {
      location.reload();
  });
});

$('.delete').on('click', event => {
  let id = $(event.target).data('id');
  $.ajax({
      method: 'DELETE',
      url: '/saved/' + id,
  }).then(() => {
      location.reload();
  });
});