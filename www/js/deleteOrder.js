$(document).ready(function () {
    let deleteOrderIds = [];
    // Check if user is authenticated 
    let userToken = localStorage.getItem('_token');
    // Perform action before the page show
    $(document).on("pagebeforeshow", "#deleteOrderPage", function () {
        // $("#deleteOrderInfo").html(``);
        const listElement = "#deleteOrderList";


        $(document).on('click', '.delete-input', function () {

            $('.delete-input').each(function (checkboxData) {
                if ($(this).is(":checked")) {
                    deleteOrderIds.push($(this).data('id'));
                    deleteOrderIds = [...new Set(deleteOrderIds)];
                } else {
                    deleteOrderIds = deleteOrderIds.filter(data => data != $(this).data('id'))
                }
            });
            if (deleteOrderIds.length > 0) {
                $('#deleteOrderBtn').attr('disabled', false);
            } else {
                $('#deleteOrderBtn').attr('disabled', true);
            }
        });
        
        $(document).on('click', '#deleteOrderBtn', function () {
            $.ajax({
                method: "DELETE",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify({
                    deleteOrderIds: deleteOrderIds
                }),
                url: `${serverUrl}/deleteUserOrders`,
                headers: {
                    "token": userToken
                }
            }).done(function (data, statusText, xhrObj) {
                localStorage.setItem('deletedCount', data.data.deleteCount)
                $.mobile.changePage("#deleteOrderConfirmationPage");
            });
        });


        if (userToken == null || userToken == undefined) {
            alert("Please login to delete the orders")
            $.mobile.changePage("#loginPage");
        } else {
            $.ajax({
                method: "GET",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify(orderInfo),
                url: `${serverUrl}/getUserOrders`,
                headers: {
                    "token": userToken
                }
            }).done(function (data, statusText, xhrObj) {
                authenticated = true;
                userOrders = data.data;

                if (userOrders != null && userOrders.length > 0) {
                    let fullName = localStorage.getItem("fullName");

                    // make html to attache to an element
                    userOrders.forEach(orderInfo => {
                        $(listElement).append('<br><table><tbody>');
                        $(listElement).append('<tr><td>Order no: </td><td><span class=\"fcolor\">' + orderInfo.orderNo + '</span></td></tr>');
                        $(listElement).append('<tr><td>Customer: </td><td><span class=\"fcolor\">' + fullName + '</span></td></tr>');
                        $(listElement).append('<tr><td>Item: </td><td><span class=\"fcolor\">' + orderInfo.item + '</span></td></tr>');
                        $(listElement).append('<tr><td>Price: </td><td><span class=\"fcolor\">' + orderInfo.price + '</span></td></tr>');
                        $(listElement).append('<tr><td>Recipient: </td><td><span class=\"fcolor\">' + orderInfo.firstName + ' ' + orderInfo.lastName + '</span></td></tr>');
                        $(listElement).append('<tr><td>Phone number: </td><td><span class=\"fcolor\">' + orderInfo.phoneNumber + '</span></td></tr>');
                        $(listElement).append('<tr><td>Address: </td><td><span class=\"fcolor\">' + orderInfo.address + ' ' + orderInfo.postcode + '</span></td></tr>');
                        $(listElement).append('<tr><td>Dispatch date: </td><td><span class=\"fcolor\">' + orderInfo.date + '</span></td></tr><br>');
                        $(listElement).append('<tr><td>Tick this box to delete: </td><td><input type="checkbox" data-id="' + orderInfo._id + '" class="delete-input"></td></tr><br>');
                        $(listElement).append('</tbody></table><br>');
                    });
                } else {
                    $(listElement).append("<p>No orders to show.</p>");
                }
            }).error(function (err) {})
            // Get the list from local storage
            // $.ajax({
            //     method: "DELETE",
            //     contentType: "application/json; charset=utf-8",
            //     dataType: "json",
            //     url: `${serverUrl}/deleteUserOrders`,
            //     headers: {
            //         "token": token
            //     }
            // }).done(function (data, statusText, xhrObj) {
            //     $("#deleteOrderInfo").append(`<p>${data.data.deleteCount} order deleted.</p>`);
            // });
        }
    })

    $(document).on("pagebeforeshow", "#deleteOrderConfirmationPage", function () {
        const deletedCount = localStorage.getItem('deletedCount')
        console.log(deletedCount)
        $("#deleteOrderInfo").append(`<p>${deletedCount} order deleted.</p>`);
    });
});