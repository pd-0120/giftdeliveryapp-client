$(document).ready(function () {
    // Perform action before the page show
    $(document).on("pagebeforeshow", "#deleteOrderPage", function () {
        $("#deleteOrderInfo").html(``);

        // Check if user is authenticated 
        let token = localStorage.getItem('_token')

        if (token == null || token == undefined) {
            alert("Please login to delete the orders")
            $.mobile.changePage("#loginPage");
        } else {
            // Get the list from local storage
            $.ajax({
                method: "DELETE",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                url: `${serverUrl}/deleteUserOrders`,
                headers: {
                    "token": token
                }
            }).done(function (data, statusText, xhrObj) {
                $("#deleteOrderInfo").append(`<p>${data.data.deleteCount} order deleted.</p>`);
            });
        }
    })
});