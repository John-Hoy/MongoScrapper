////////////////////////
// Scrape Button
////////////////////////

$("#scrape").on("click", () => {
     $.ajax({
          method: "GET",
          url: "/scrape",
     }).done((data) => {
          console.log(data)
          window.location = "/"
     });
});

//Set clicked nav option to active
$(".navbar-nav li").click(() => {
     $(".navbar-nav li").removeClass("active");
     $(this).addClass("active");
});

//Handle Save Article button
$(".save").on("click", () => {
     var thisId = $(this).attr("data-id");
     $.ajax({
          method: "POST",
          url: `/articles/save/${thisId}`
     }).done((data) => {
          window.location = "/"
     });
});

//Handle Delete Article button
$(".delete").on("click", () => {
     var thisId = $(this).attr("data-id");
     $.ajax({
          method: "POST",
          url: `/articles/delete/${thisId}`
     }).done((data) => {
          window.location = "/saved"
     });
});

//Handle Save Note button
$(".saveNote").on("click", () => {
     var thisId = $(this).attr("data-id");
     if (!$(`#noteText${thisId}`).val()) {
          alert("please enter a note to save")
     } else {
          $.ajax({
               method: "POST",
               url: `/notes/save/${thisId}`,
               data: {
                    text: $(`#noteText${thisId}`).val()
               }
          }).done((data) => {
               // Log the response
               console.log(data);
               // Empty the notes section
               $(`#noteText${thisId}`).val("");
               $(".modalNote").modal("hide");
               window.location = "/saved"
          });
     }
});

//Handle Delete Note button
$(".deleteNote").on("click", () => {
     var noteId = $(this).attr("data-note-id");
     var articleId = $(this).attr("data-article-id");
     $.ajax({
          method: "DELETE",
          url: `/notes/delete/${noteId}/${articleId}`
     }).done((data) => {
          console.log(data)
          $(".modalNote").modal("hide");
          window.location = "/saved"
     })
});