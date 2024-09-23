//==================================index.js==================================//

var debug = false;
var authenticated = false;
// const serverUrl = "http://localhost:3000";
const serverUrl = "https://giftdeliveryapp-server.onrender.com";

$(document).ready(function () {
	// Perform action before the page show. check wheather the user is logged in or not.

	$(document).on("pagebeforeshow", "#homePage", function () {
		authMiddleware();
	})

	$(document).on("pagebeforeshow", "#selectPage", function () {
		authMiddleware();
	})
	$(document).on("pagebeforeshow", "#fillOrderPage", function () {
		authMiddleware();
	})
	$(document).on("pagebeforeshow", "#orderConfirmationPage", function () {
		authMiddleware();
	})
	$(document).on("pagebeforeshow", "#pastOrderPage", function () {
		authMiddleware();
	})
	$(document).on("pagebeforeshow", "#deleteOrderPage", function () {
		authMiddleware();
	})


	function authMiddleware() {

		let authUser = localStorage.getItem('_token');
		if (authUser == "null" || authUser == "undefined" || authUser == null || authUser == undefined) {
			
			alert("Please login to access the page.")
			$.mobile.changePage("#loginPage");
		}
	}



	/**
	----------------------Event handler to process login request----------------------
	**/

	$('#loginButton').click(function () {

		localStorage.removeItem("inputData");

		$("#loginForm").submit();

		if (localStorage.inputData != null) {

			var inputData = JSON.parse(localStorage.getItem("inputData"));
			$.ajax({
				method: "POST",
				contentType: "application/json; charset=utf-8",
				dataType: "json",
				data: JSON.stringify(inputData),
				url: `${serverUrl}/login`,
			}).done(function (data, statusText, xhrObj) {
				if (data.status == 200) {
					localStorage.setItem("_token", data.data.token);
					localStorage.setItem("fullName", data.data.fullName);
				}
				authenticated = true;
				$("#loginForm").trigger('reset');
				$.mobile.changePage("#homePage");

			}).error(function (err) {

			})
		}
	})



	$("#loginForm").validate({ // JQuery validation plugin
		focusInvalid: false,
		onkeyup: false,
		submitHandler: function (form) {

			var formData = $(form).serializeArray();
			var inputData = {};
			formData.forEach(function (data) {
				inputData[data.name] = data.value;
			})

			localStorage.setItem("inputData", JSON.stringify(inputData));
		},
		/* Validation rules */
		rules: {
			email: {
				required: true,
				email: true
			},
			password: {
				required: true,
				rangelength: [3, 10]
			}
		},
		/* Validation message */
		messages: {
			email: {
				required: "Please enter your email",
				email: "The email format is incorrect"
			},
			password: {
				required: "Password cannot be empty",
				rangelength: $.validator.format("Minimum Password Length:{0}, Maximum Password Length:{1}。")

			}
		},
	});
	/**
	--------------------------end--------------------------
	**/


	/**
	------------Event handler to respond to selection of gift category-------------------
	**/
	$('#itemList li').click(function () {

		var itemName = $(this).find('#itemName').html();
		var itemPrice = $(this).find('#itemPrice').html();
		var itemImage = $(this).find('#itemImage').attr('src');

		localStorage.setItem("itemName", itemName);
		localStorage.setItem("itemPrice", itemPrice);
		localStorage.setItem("itemImage", itemImage);

	})

	/**
	--------------------------end--------------------------
	**/


	/**
	--------------------Event handler to process order confirmation----------------------
	**/

	// Store order
	$('#confirmOrderButton').on('click', function () {

		localStorage.removeItem("inputData");

		$("#orderForm").submit();

		if (localStorage.inputData != null) {

			var orderInfo = JSON.parse(localStorage.getItem("inputData"));

			orderInfo.item = localStorage.getItem("itemName")
			orderInfo.price = localStorage.getItem("itemPrice")
			orderInfo.img = localStorage.getItem("itemImage")

			var userToken = (localStorage.getItem("_token"));

			orderInfo.orderNo = Math.trunc(Math.random() * 1000000);
			// call the backend service to store the data
			$.ajax({
				method: "POST",
				contentType: "application/json; charset=utf-8",
				dataType: "json",
				data: JSON.stringify(orderInfo),
				url: `${serverUrl}/postOrderData`,
				headers: {
					"token": userToken
				}
			}).done(function (data, statusText, xhrObj) {
				authenticated = true;
				$("#orderForm").trigger('reset');
				$.mobile.changePage("#orderConfirmationPage");

			}).error(function (err) {

			})
		}
	})


	$("#orderForm").validate({ // JQuery validation plugin
		focusInvalid: false,
		onkeyup: false,
		submitHandler: function (form) {

			var formData = $(form).serializeArray();
			var inputData = {};

			formData.forEach(function (data) {
				inputData[data.name] = data.value;
			});

			localStorage.setItem("inputData", JSON.stringify(inputData));
		},

		/* validation rules */

		rules: {
			firstName: {
				required: true,
				rangelength: [1, 15],
				validateName: true
			},
			lastName: {
				required: true,
				rangelength: [1, 15],
				validateName: true
			},
			phoneNumber: {
				required: true,
				mobiletxt: true
			},
			address: {
				required: true,
				rangelength: [1, 25]
			},
			postcode: {
				required: true,
				posttxt: true
			},
		},
		/* Validation Message */

		messages: {
			firstName: {
				required: "Please enter your firstname",
				rangelength: $.validator.format("Contains a maximum of{1}characters"),

			},
			lastName: {
				required: "Please enter your lastname",
				rangelength: $.validator.format("Contains a maximum of{1}characters"),
			},
			phoneNumber: {
				required: "Phone number required",
			},
			address: {
				required: "Delivery address required",
				rangelength: $.validator.format("Contains a maximum of{1}characters"),
			},
			postcode: {
				required: "Postcode required",

			},
		}
	});


	/**
	--------------------Event handler to perform initialisation before the Login page is displayed--------------------
	**/


	$(document).on("pagebeforeshow", "#loginPage", function () {

		localStorage.removeItem("userInfo");

		authenticated = false;
	});

	/**
	--------------------------end--------------------------
	**/

	/**
	--------------------Event handler to populate the Fill Order page before it is displayed---------------------
	**/

	$(document).on("pagebeforeshow", "#fillOrderPage", function () {

		$("#itemSelected").html(localStorage.getItem("itemName"));
		$("#priceSelected").html(localStorage.getItem("itemPrice"));
		$("#imageSelected").attr('src', localStorage.getItem("itemImage"));

	});

	/**
	--------------------------end--------------------------
	**/


	/**
	--------------------Event handler to populate the Order Confirmation page before it is displayed---------------------
	**/

	$(document).on("pagebeforeshow", "#orderConfirmationPage", function () {

		$('#orderInfo').html("");

		if (localStorage.orderInfo != null) {

			var orderInfo = JSON.parse(localStorage.getItem("orderInfo"));
			let fullName = localStorage.getItem("fullName");
			$('#orderInfo').append('<br><table><tbody>');
			$('#orderInfo').append('<tr><td>Order no: </td><td><span class=\"fcolor\">' + orderInfo.orderNo + '</span></td></tr>');
			$('#orderInfo').append('<tr><td>Customer: </td><td><span class=\"fcolor\">' + fullName + '</span></td></tr>');
			$('#orderInfo').append('<tr><td>Item: </td><td><span class=\"fcolor\">' + orderInfo.item + '</span></td></tr>');
			$('#orderInfo').append('<tr><td>Price: </td><td><span class=\"fcolor\">' + orderInfo.price + '</span></td></tr>');
			$('#orderInfo').append('<tr><td>Recipient: </td><td><span class=\"fcolor\">' + orderInfo.firstName + ' ' + orderInfo.lastName + '</span></td></tr>');
			$('#orderInfo').append('<tr><td>Phone number: </td><td><span class=\"fcolor\">' + orderInfo.phoneNumber + '</span></td></tr>');
			$('#orderInfo').append('<tr><td>Address: </td><td><span class=\"fcolor\">' + orderInfo.address + ' ' + orderInfo.postcode + '</span></td></tr>');
			$('#orderInfo').append('<tr><td>Dispatch date: </td><td><span class=\"fcolor\">' + orderInfo.date + '</span></td></tr>');
			$('#orderInfo').append('</tbody></table><br>');
		} else {
			$('#orderInfo').append('<h3>There is no order to display<h3>');
		}
	});

	$('#logoutBtn').click(function() {
		localStorage.removeItem('_token');
		localStorage.removeItem('fullName');
		$.mobile.changePage("#loginPage");
	})

	/**
	--------------------------end--------------------------
	**/
});