$(document).ready(function () {
	$(document).on("pagebeforeshow", "#pastOrderPage", function () {
		const listElement = "#orderList";
		$(listElement).html("");
		const userToken = localStorage.getItem("_token");

		if (userToken == null) {
			alert("Please login to see the orders")
			$.mobile.changePage("#loginPage");
		}

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
				
				// make html to attache to an element
				userOrders.forEach(orderInfo => {
					$(listElement).append('<br><table><tbody>');
					$(listElement).append('<tr><td>Order no: </td><td><span class=\"fcolor\">' + orderInfo.orderNo + '</span></td></tr>');
					$(listElement).append('<tr><td>Customer: </td><td><span class=\"fcolor\">' + orderInfo.customerEmail + '</span></td></tr>');
					$(listElement).append('<tr><td>Item: </td><td><span class=\"fcolor\">' + orderInfo.item + '</span></td></tr>');
					$(listElement).append('<tr><td>Price: </td><td><span class=\"fcolor\">' + orderInfo.price + '</span></td></tr>');
					$(listElement).append('<tr><td>Recipient: </td><td><span class=\"fcolor\">' + orderInfo.firstName + ' ' + orderInfo.lastName + '</span></td></tr>');
					$(listElement).append('<tr><td>Phone number: </td><td><span class=\"fcolor\">' + orderInfo.phoneNumber + '</span></td></tr>');
					$(listElement).append('<tr><td>Address: </td><td><span class=\"fcolor\">' + orderInfo.address + ' ' + orderInfo.postcode + '</span></td></tr>');
					$(listElement).append('<tr><td>Dispatch date: </td><td><span class=\"fcolor\">' + orderInfo.date + '</span></td></tr><br>');
					$(listElement).append('</tbody></table><br>');
				});
			} else {
				$(listElement).append("<p>No orders to show.</p>");
			}
			// $.mobile.changePage("#homePage");

		}).error(function (err) {

		})
	});
});