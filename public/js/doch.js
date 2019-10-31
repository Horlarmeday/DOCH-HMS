

$(document).ready(function() {
     //HIDING AND SHOWING DEPARTMeNT WHEN CHOOSING DOCTOR
	$('#role').change(function () {
		var role = $('#role').val()
		if(role === '2' || role === '3'){
			$('#department').show()
		}else{
			$('#department').hide()
		}
    })

   


    $('.checkbox1').click(function(){
        if($(this).prop("checked") == true){
            let drugword = $(this).attr('value')
            // let checkId = $(this).attr('id')
            // let consultId = $(this).attr('name')
            console.log(drugword)
            $.ajax({
                type: 'POST',
                url: '/get-drug-price',
                data: {
                    drugword: drugword,
                    // checkId: checkId,
                    // consultId: consultId
                },
                success:function (data) {
                    
                    $('.unitamount').html(data)
                }
            })
        }
        else if($(this).prop("checked") == false){
            alert("Checkbox is unchecked.");
        }
    });

    //making patient an emergency
    $('.emerg').click(function(){
        if($(this).prop("checked") == true){
            let patientIdentity = $(this).attr('name')
           
            $.ajax({
                type: 'POST',
                url: '/emergency-patient',
                data: {
                    patientIdentity : patientIdentity
                },
                success:function (data) {
                   $('.emerencypatient').html('Patient is an emergency patient')
                }
            })
        }
        
    })

    ///Making patient an emerency
    $('.emergy').click(function(){
        if($(this).prop("checked") == true){
            let Identity = $('#patienttriage').val()
           
            $.ajax({
                type: 'POST',
                url: '/make-patient-emergency',
                data: {
                    Identity : Identity
                },
                success:function (data) {
                   $('.emerencypatient').html('Patient is an emergency patient')
                }
            })
        }
        
    })

    


    //SENDING APPOINTMENT ID
    $('.btn-app').click(function (event) {
        let app_id = $(this).attr('id')
        console.log(app_id)
        event.preventDefault()
        $.ajax({
            type: 'POST',
            url: '/takeup-appointment',
            data: {
                app_id: app_id
            },
            success:function (data) {
                location.reload()
            }
        })
    })

    //CLICKING PAID MONEY
    $('.pay').click(function (event) {
        let patientId = $(this).attr('name')
        let regamount = $(this).attr('value')
        let modeofpayment = $('#modeofpayment1').val()
        console.log(modeofpayment)
        event.preventDefault()
        var accept = window.confirm(`Are you sure patient has paid N${regamount}?`);
        if(accept){
            $.ajax({
                type: 'POST',
                url: '/accounts',
                data: {
                    patientId: patientId,
                    regamount: regamount,
                    modeofpayment: modeofpayment
                },
                success:function (data) {
                    location.reload()
                }
            })
           
        }else{
            window.close()
        }
    })

    //CLICKING PAID FOR LAB
    $('.labpay').click(function (event) {
        let consultationId = $(this).attr('name')
        let labamount = $(this).attr('value')
        let modeofpayment = $('#modeofpayment2').val()
        event.preventDefault()
        var confirm = window.confirm(`Are you sure patient has paid N${labamount}?`);
        if(confirm){
            $.ajax({
                type: 'POST',
                url: '/lab-test-payment',
                data: {
                    consultationId: consultationId,
                    labamount: labamount,
                    modeofpayment: modeofpayment
                },
                success:function (data) {
                    location.reload()
                }
            })
            
        }else{
            window.close()
        }
    })

   
    $('.imagingpay').click(function (event) {
        let imagingId = $(this).attr('name')
        let imagingAmount = $(this).attr('value')
        let modeofpayment = $('#modeofpayment4').val()
        event.preventDefault()
        var accepted = window.confirm(`Are you sure patient has paid N${imagingAmount}?`);
        if(accepted){
            $.ajax({
                type: 'POST',
                url: '/imaging-payment',
                data: {
                    imagingId: imagingId,
                    imagingAmount: imagingAmount,
                    modeofpayment: modeofpayment
                },
                success:function (data) {
                    location.reload()
                }
            })
            
        }else{
            window.close()
        }
    })

    //CLICKING PAID FOR DRUGS
    $('.drugpay').click(function (event) {
        let pharmId = $(this).attr('name')
        let amount = $(this).attr('value')
        let modeofpayment = $('#modeofpayment3').val()
        event.preventDefault()
        var result = window.confirm(`Are you sure patient has paid N${amount}?`);
        if(result){
            $.ajax({
                type: 'POST',
                url: '/pharmacy-payment',
                data: {
                    pharmId: pharmId,
                    amount: amount,
                    modeofpayment: modeofpayment 
                },
                success:function (data) {
                    location.reload()
                }
            })
            
        }else{
            window.close()
        }
    })

    //CLICKING PRESCRIBED BUTTON
    $('.paid').click(function (event) {
        let prescribe = $(this).attr('id')
        event.preventDefault()
        let done = window.confirm('Are you sure?')
        if(done){
            $.ajax({
                type: 'POST',
                url: '/prescribed',
                data: {
                    prescribe: prescribe
                },
                success:function (data) {
                    location.reload()
                }
            })
        }else{
            window.close()
        }
    })

     //CLICKING DONE BUTTON
     $('.done').click(function (event) {
        let imaging = $(this).attr('id')
        let comment = $('.imagingcomment').val()
        event.preventDefault()
        let acceptance = window.confirm('Are you sure?')
        if(acceptance){
            $.ajax({
                type: 'POST',
                url: '/imaging-done',
                data: {
                    imaging: imaging,
                    comment: comment
                },
                success:function (data) {
                    location.reload()
                }
            })
        }else{
            window.close()
        }
    })

    //SENDING PATIENT TO DOCTOR
    $('.seedoctor').click(function (event) {
        let seen = $(this).attr('name')
        console.log(seen)
        event.preventDefault()
        let checked = window.confirm('Send patient to see the doctor?')
        if(checked){
            $.ajax({
                type: 'POST',
                url: '/see-doctor',
                data: {
                    seen: seen
                },
                success:function (data) {
                    location.reload()
                }
            })
        }else{
            window.close()
        }
    })
    

    //CLICKING FINISHED BUTTON
    $('.finish').click(function (event) {
        let test = $(this).attr('id')
        event.preventDefault()
        let testfinish = window.confirm('Are you sure?')
        if(testfinish){
            $.ajax({
                type: 'POST',
                url: '/labtest-finish',
                data: {
                    test: test
                },
                success:function (data) {
                    location.reload()
                }
            })
        }else{
            window.close()
        }
    })

    //CLICKING APPROVED BUTTON
    $('.approve').click(function (event) {
        let approve = $(this).attr('value')
        console.log(approve)
        event.preventDefault()
        var answer = window.confirm("Are you sure you want to approve?");
        if(answer){
            $.ajax({
                type: 'POST',
                url: '/approve-request',
                data: {
                    approve: approve
                },
                success:function (data) {
                    location.reload()
                }
            })
        }else{
            window.close()
        }
        
    })

    // ACCOUNT CHECK BOX IS CHECKED
    $('.drugChecked').click(function () {
        const Choosen = $(this).attr('id')
        const ChoosenConsultation = $(this).attr('name')
        const drugChoosen = parseInt(Choosen)
        if ($(this).prop('checked') == true){
            $.ajax({
                type: 'POST',
                url: '/change-status-paid',
                data: {
                    drugChoosen: drugChoosen,
                    ChoosenConsultation: ChoosenConsultation
                },
                success:function (data) {
                    $('.theprice').html(data.amount)
                }
            })
        }else if($(this).prop('checked') == false){
            $.ajax({
                type: 'POST',
                url: '/change-status-unpaid',
                data: {
                    drugChoosen: drugChoosen,
                    ChoosenConsultation: ChoosenConsultation
                },
                success:function (data) {
                    $('.theprice').html(data.amount)
                   
                }
            })
        }
    })

    
    // ACCOUNT CHECK BOX IS CHECKED
    $('.labChecked').click(function () {
        const Choosen = $(this).attr('id')
        const ChoosenConsultation = $(this).attr('name')
        const testChoosen = parseInt(Choosen)
       
        if ($(this).prop('checked') == true){
            $.ajax({
                type: 'POST',
                url: '/change-lab-status-paid',
                data: {
                    testChoosen: testChoosen,
                    ChoosenConsultation: ChoosenConsultation
                },
                success:function (data) {
                    $('.theprice').html(data.amount)
                
                }
            })
        }else if($(this).prop('checked') == false){
            $.ajax({
                type: 'POST',
                url: '/change-lab-status-unpaid',
                data: {
                    testChoosen: testChoosen,
                    ChoosenConsultation: ChoosenConsultation
                },
                success:function (data) {
                    $('.theprice').html(data.amount)
               
                }
            })
        }
    })

 

    //MANAGER REQUEST APPROVAL 
    $('.approval').click(function (event) {
        let approval = $(this).attr('value')
        event.preventDefault()
        let reqanswer = window.confirm("Are you sure you want to approve this request?");
        if(reqanswer){
            $.ajax({
                type: 'POST',
                url: '/manager-approve-request',
                data: {
                    approval: approval
                },
                success:function (data) {
                    location.reload()
                }
            })
        }else{
            window.close()
        }
        
    })

    //PHHARMACY INVOICE 
    $('.drugInvoice').click(function (event) {
        let invoice = $(this).attr('name')
        event.preventDefault()
        let druganswer = window.confirm("Are you sure you want to print invoice?");
        if(druganswer){
            $.ajax({
                type: 'POST',
                url: '/print-invoice',
                data: {
                    name: 'Drug Invoice',
                    consultation: invoice
                },
                success:function (data) {
                    location.href('')
                }
            })
        }else{
            window.close()
        }
        
    })

    $('#example-1').multifield();
    $('#example-2').multifield();
    $('#form-show').multifield();


     //CLICKING DECLINED BUTTON
     $('.decline').click(function (event) {
        let decline = $(this).attr('value')
        event.preventDefault()
        let declineit = window.confirm('Are you sure you want to deny this request?')
        if(declineit) {
            $.ajax({
                type: 'POST',
                url: '/decline-request',
                data: {
                    decline: decline
                },
                success:function (data) {
                    location.reload()
                }
            })
        }else{
            window.close()
        }
    })

    //MANAGER REQUEST DENIAL
    $('.denial').click(function (event) {
        let denial = $(this).attr('value')
        event.preventDefault()
        let requestDeny = window.confirm("Are you sure you want to deny this request?")
        if(requestDeny){
            $.ajax({
                type: 'POST',
                url: '/manager-decline-request',
                data: {
                    denial: denial
                },
                success:function (data) {
                    location.reload()
                }
            })
        }else{
            window.close()
        }
    })

    //APPROVING BILLING PAYMENT
    $('.billingpay').click(function (event) {
        let approve = $(this).attr('id')
        event.preventDefault()
         let response = window.confirm("Are you sure you want to approve?");
         if(response){
            $.ajax({
                type: 'POST',
                url: '/approve-billing',
                data: {
                    approve: approve
                },
                success:function (data) {
                    location.reload()
                }
            })
         }else{
             window.close()
         }
    })

    $('.remove-drug').click(function (event) {
        let clickedConsultation = $(this).attr('name')
        let theClicked = $(this).attr('type')
        let indexClicked = parseInt(theClicked)
        event.preventDefault()
         let response = window.confirm("Are you sure you want to approve?");
         if(response){
            $.ajax({
                type: 'POST',
                url: '/remove-drug',
                data: {
                    indexClicked: indexClicked,
                    clickedConsultation: clickedConsultation
                },
                success:function (data) {
                    location.reload()
                }
            })
         }else{
             window.close()
         }
    })

    // $('.drugger').click(function (event) {
    //     const consultId = $(this).attr('id')
    //     console.log(consultId)
    //     $.post('/get-drugs-prescription', { consultId: consultId })
    //     .done(function(data) {
    //         console.log(data)
            
    //     })
    // })

    


    //Getting the cardtype
    $('#cardtype').change(function () {
        let cardtype = $('#cardtype').val()
        if(cardtype === "Family"){
            $('#num').show()
            $('.content').show()
        }else{
            $('#num').hide()
            $('.content').hide()
        }
    })

    let numberoffamily = $('#numboffamily').val()
    

    //Calculating the Purcahse cost
    $('#sale_price').change(function () {
        let salePrice = $('#sale_price').val()
        let quantity = $('#quantity').val()
        var totalCost = salePrice * quantity
        $('#cost').val(totalCost)
    })

    //Calculating the Selling cost
    $('#sell_price').change(function () {
        let sellPrice = $('#sell_price').val()
        let quantity = $('#quantity').val()
        var totalincome = sellPrice * quantity
        $('#income').val(totalincome)
    })

    $('#by').change(function () {
        var itemID = new Date();
        console.log(itemID)
        $('#dateReceived').val(itemID.toDateString())
    })

    //Calculating the BMI
    $('#height').change(function () {
        let weight = $('#weight').val()
        let height = $('#height').val()
        let bmi = weight/(height**2)
        $('#bmi').val(bmi)
    })

    //Checking if password is equal to confirm password
    $('#confirmpassword').change(function () {
        let newpassword = $('#newpassword').val()
        let confirmpassword = $('#confirmpassword').val()
        if(newpassword != confirmpassword){
            $('#save').prop('disabled', true)
            $('#message').addClass('color-message').html('Confirm Password not same with New Password')
        }else{
            $('#save').prop('disabled', false)
            $('#message').removeClass('color-message').html('')
        }
    })

    
    //DISPLAYING HMOS
    $('#retain').change(function () {
        var retain = $('#retain').val();
        var amount1 = $('#registration1').val()
        var amount2 = $('#registration2').val()
        var payment1 = $('#consultation1').val()
        var payment2 = $('#consultation2').val()
        if(retain === 'Yes'){
            $('#retainershipname').show()
            $('.reg-payment').hide()
            $('input[name="registration"]').attr('required', false)
            $('input[name="consultation"]').attr('required', false)
            // let newAmount1 = amount1 * 0.1
            // let newAmount2 = amount2 * 0.1
            // let newPayment1 = payment1 * 0.1
            // let newPayment2 = payment2 * 0.1
            // //REGISTRATION
            // $('#registration1').val(newAmount1)
            // $('#regis1').html(newAmount1)
            // $('#registration2').val(newAmount2)
            // $('#regis2').html(newAmount2)

            // //CONSULTATION
            // $('#consultation1').val(newPayment1)
            // $('#consult1').html(newPayment1)
            // $('#consultation2').val(newPayment2)
            // $('#consult2').html(newPayment2)

        }else{
            $('#hmos').val('')
            $('#mySelect').val('')
            $('.hmocode').val('')
            $('.retainershipname').val('')
            $('.hmoname').val('')
            $('.dependanname').val('')
            $('.dependandate').val('')
            $('.dependanfile').val('')
            $('.reg-payment').show()
            $('#retainershipname').hide()
            $('#hmoname').hide()
            $('#patientId').hide()
            $('#dependants').hide()
            $('.depend').hide()
            $('.form-block2').hide()
            $('.form-block3').hide()
            $('#btn-addition').hide()
            $('#btn-subtract').hide()

            //REGISTRATION
            $('#registration1').val(amount1)
            $('#regis1').html(amount1)
            $('#registration2').val(amount2)
            $('#regis2').html(amount2)
            $('input[name="registration"]').attr('required', true)
            $('input[name="consultation"]').attr('required', true)

            //CONSULTATION
            $('#consultation1').val(payment1)
            $('#consult1').html(payment1)
            $('#consultation2').val(payment2)
            $('#consult2').html(payment2)
        }
    })

     //CLONING DEPENDANT FORM
     $('.add-more-btn').click(function() {
        // var clone = $('.form-block').clone('.form-clone');
        // $('.form-block').append(clone);
        $('.form-block2').show()
    });

    $('.add-btn').click(function() {
        // var clone = $('.form-block').clone('.form-clone');
        // $('.form-block').append(clone);
        $('.form-block3').show()
    });

    //DISPLAYING EDD
    // $('#lmp').on('change', function () {
    //     let lmp = $('#lmp').val()
    //     console.log(lmp)
    //     let date = new Date(lmp)
    //     let day = date.getDate() + 7
    //     let month = date.getMonth()
    //     if(month < 3){
    //         month += 9
    //     }else{
    //         month -= 3
    //     }
    //     // var year = date.getFullYear()
    //     date.setDate(day)
    //     date.setMonth(month)
    //     let newdate = date.toDateString()
    //     $('#edd').val(newdate)
    // })

    
    $('.localItem').click(function (event) {
        let localItem = $(this).attr('id')
        event.preventDefault()
        let itemDelete = window.confirm("Are you sure you want to delete this item?")
        if(itemDelete){
            $.ajax({
                type: 'POST',
                url: `/delete-drugs/${localItem}`,
                data: {
                    localItem: localItem
                },
                success:function (data) {
                    location.reload()
                }
            })
        }else{
            window.close()
        }
    })

    ///////////////////////////////////////
    // FILTERING ON MEDICAL RECORDS PAE
    $('#btn-week').click(function () {
        $('#thisweek').show()
        $('#thismonth').hide()
        $('#today').hide()
        $('#total').hide()
    })
        //LAST 30 DAYS BTN
    $('#btn-last30').click(function () {
        $('#thisweek').hide()
        $('#thismonth').show()
        $('#today').hide()
        $('#total').hide()
    })
        //TOTAL BTN
    $('#btn-total').click(function () {
        $('#thisweek').hide()
        $('#thismonth').hide()
        $('#today').hide()
        $('#total').show()
    })
        //TODAY BTN
   $('#btn-today').click(function name() {
        $('#thisweek').hide()
        $('#thismonth').hide()
        $('#today').show()
        $('#total').hide()
    })
////////////////////////////////////

 ///////////////////////////////////////
    // FILTERING ON PAYMENT RECORDS PAE
    $('#payment-week').click(function () {
        $('.allpayments').hide()
        $('.paymentToday').hide()
        $('.paymentThisWeek').show()
        $('.paymentLast30Days').hide()
    })
        //LAST 30 DAYS BTN
    $('#payment-30days').click(function () {
        $('.allpayments').hide()
        $('.paymentToday').hide()
        $('.paymentThisWeek').hide()
        $('.paymentLast30Days').show()
    })
        //TOTAL BTN
    $('#payment-total').click(function () {
        $('.allpayments').show()
        $('.paymentToday').hide()
        $('.paymentThisWeek').hide()
        $('.paymentLast30Days').hide()
    })
        //TODAY BTN
   $('#payment-today').click(function name() {
        $('.allpayments').hide()
        $('.paymentToday').show()
        $('.paymentThisWeek').hide()
        $('.paymentLast30Days').hide()
    })
////////////////////////////////////

//
$('#quantityused').change(function () {
    const quantityused = $('#quantityused').val()
    // const extra = $('#extra').val()
    const price = $('#pharmPrice').val()
    // if(extra === undefined || extra === null)
    //     {
    //         extra = 0
    //     }
    // const finalAmount = quantityused + extra
    $('#totalPharm').val(price * quantityused)
})

$('.country').change(function () {
    const country = $('.country').val()
   
    if(country === 'Foreigner')
        {
           $('.foreign').show()
           $('.nigeria').hide()
           $('.localgovt').prop('disabled', true)
        }else{
            $('.foreign').hide()
           $('.nigeria').show()
           $('.localgovt').prop('disabled', false)
        }
   
})

//Checking patient temp
$('.temperature').change(function () {
    const temp = $('.temperature').val()
  
    if(temp >= 38)
        {
           $('.emergency').show()
         
        }else{
            $('.emergency').hide()
        }
   
})


//checking file size before upload
$(".file-size").change(function() {
    if (this.files[0].size > 7000000) {
        alert("Try to upload file less than 7MB!");
        $(this).val("");
    }
});



//
$('.userbirtday').change(function () {
    const birtday = $('.userbirtday').val()
    var birthday = new Date(birtday)
    var today = new Date()
    var age = today.getFullYear() - birthday.getFullYear()
    if(today.getMonth() < birthday.getMonth()){
        age
    }
    if(today.getMonth() == birthday.getMonth() && today.getDate() < birthday.getDate()){
        age
    }
     
    if(age < 18){
        $('.regadult').hide()
        $('.regchildren').show()
        $('.consultadult').hide()
        $('.consultchildren').show()
    }else{
        $('.regadult').show()
        $('.regchildren').hide()
        $('.consultadult').show()
        $('.consultchildren').hide()
    }
   
})




})

function openPatientId() {
    $('#patientId').show()
    $('#dependants').show()
    $('.depend').show()
    $('#btn-addition').show()
    $('#btn-subtract').show()
}

function showOptions() {
    $('select #serology').show()
    // alert("id is " + s[s.selectedIndex].id); // get id
}

//getting the hmos
function gethmo() {
    const hmoid = $('#hmos').val()
    $('#hmoname').show()
    $.post('/get-hmo', { hmoid: hmoid })
    .done(function(data) {
        $("#mySelect option[value]").remove();
        $.each(data, function(index, value){
            $("#mySelect").append($("<option>",{
                  value: value,
                  text: value
            }))
        })
    })
}

// getting the imaging investigations
function getImaging() {
    const image = $('#image').val()
    $.post('/get-imaging', { image: image })
    .done(function(data) {
        $("#myImage option[value]").remove();
        $.each(data, function(index, value){
            $("#myImage").append($("<option>",{
                  value: value.id,
                  text: value.images
            }))
        })
    })
}

function getInvestigationPrice(){
    const price = $('#myImage').val()
    $.post('/get-imaging-price', { price: price })
    .done(function(data) {
        $("#imagePrice").val(data)
    })
}

// ggetting the lab tests
function getTests() {
    const lab = $('#lab').val()
    $.post('/get-lab', { lab: lab })
    .done(function(data) {
        $("#myTests option[value]").remove();
        $.each(data, function(index, value){
            $("#myTests").append($("<option>",{
                  value: value.id,
                  text: value.tests
            }))
        })
    })
}



function getTestPrice(){
    const price = $('#myTests').val()
    $.post('/get-tests-price', { price: price })
    .done(function(data) {
        $("#testPrice").val(data)
    })
}

//getting user age
function getUserAge() {
    const userid = $('#patienttriage').val()
    $('#agecolumn').show()
    $.post('/get-patient-age', { userid: userid })
    .done(function(data) {
        console.log(data)
        $('#age').val(data)
        if(data < 1){
            $('#pulse').hide()
            $('#hrate').show()
        }else{
            $('#pulse').show()
            $('#hrate').hide()
        }
    })
}

//FUnction to calciulate BMI
function bmiCalc(){
    let weight = $('#weight').val()
    let height = $('#height').val()
    let bmi = weight/(height**2)
    $('#bmi').val(bmi)
}

//Getting the total amount of service
function serviceTotalAmount() {
    const theservice = $('#theservice').val()
    $.post('/get-total-amount', { theservice: theservice })
    .done(function(data) {
        console.log(data)
        $('#serviceprice').val(data)
    })
}

function getDrugInfo() {
    const drugId = $('#itemId').val()
    $.post('/get-drug-info', { drugId: drugId })
    .done(function(data) {
        //console.log(data)
        $('#drugAmount').val(data.price)
        $('#productCode').val(data.code)
        

        if(('rquantity' in data && data[1] === undefined)){
            $('#drugRemainder').val(data.rquantity)
        }else{
            $('#drugRemainder').val(data.quantity)
        }
    })
}

//Sow addmission
function showAddmission(){
    let addmission = $('#visittype').val()
    
    if(addmission === 'Admission'){
        $('#addmission').show()
        $('#discharge').show()
    }else{
        $('#addmission').hide()
        $('#discharge').hide()
    }
}

function showTransferTo(){
    let dischargetype = $('#dischargetype').val()
    
    if(dischargetype === 'Transfer'){
        $('#transfer').show()
     
    }else{
        $('#transfer').hide()
       
    }
}

//Function to calculate drugs dosage
function dosageCalc(){
    let duration = $('.duration').val()
    let frequency = $('.frequency').val()
    let time = $('.time').val()

    let dosage = duration * frequency * time
    $('.quantity').val(dosage)
    $('.iquantity').val(dosage)
}

//egettin drugg price
function getDrugPrice() {
    const itemCode = $('#itemCode').val()
    $.post('/get-pharmacy-price', { itemCode: itemCode })
    .done(function(data) {
        //console.log(data)
        $('#pharmPrice').val(data)
       
    })
}

function getLocalDrugPrice() {
    const itemCode = $('#itemCode').val()
    $.post('/get-dispensory-price', { itemCode: itemCode })
    .done(function(data) {
        console.log(data)
        if(data.balance === '' || data.balance === undefined){
            $('#localPrice').val(data.price)
            $('#localRemain').val(data.quantity)
        }else{
            $('#localPrice').val(data.price)
            $('#localRemain').val(data.balance)
        }
       
    })
}

// function removeDrug() {
//     let drug_ID = $(this).attr('id')
//     console.log(drug_ID)
//     // $.post('/get-dispensory-price', { itemCode: itemCode })
//     // .done(function(data) {
//     //     //console.log(data)
//     //     $('#localPrice').val(data.price)
//     //     $('#localRemain').val(data.balance)
       
//     // })
// }


//Lab tests
function testSelect () {
    const testselected = $('#testselect').val()
    if(testselected === 'Sputum'){
        $('.appea').show()
        $('.semen').hide()
    }else if (testselected === 'Semen'){
        $('.appea').hide()
        $('.semen').show()
    }else{
        $('.appea').hide()
        $('.semen').hide()
    }
}

//HIDE TIME OF SURGERY
function timeOfSurgery() {
    let modeofsurger = $('#modeofsurgery').val()
		if(modeofsurger === 'CS'){
			$('.cs').show()
		}else{
			$('.cs').hide()
		}
    
}

//FUNCTIONS CALCULATING EDD AND GA
function isValidDate(dateStr) {
    // Date validation function courtesty of 
    // Sandeep V. Tamhankar (stamhankar@hotmail.com) -->
    
    // Checks for the following valid date formats:
    // yyyy/mm/dd  
    
      var datePat = /^\d{4}-\d{2}-\d{2}$/; // requires 4 digit year
      
      var matchArray = dateStr.match(datePat); // is the format ok?
      if (matchArray == null) {
      alert("Date is not in a valid format.")
      return false;
      }
      month = matchArray[1]; // parse date into variables
      day = matchArray[3];
      year = matchArray[4];
      if (month < 1 || month > 12) { // check month range
      alert("Month must be between 1 and 12.");
      return false;
      }
      if (day < 1 || day > 31) {
      alert("Day must be between 1 and 31.");
      return false;
      }
      if ((month==4 || month==6 || month==9 || month==11) && day==31) {
      alert("Month "+month+" doesn't have 31 days!")
      return false;
      }
      if (month == 2) { // check for february 29th
      var isleap = (year % 4 == 0 && (year % 100 != 0 || year % 400 == 0));
      if (day>29 || (day==29 && !isleap)) {
      alert("February " + year + " doesn't have " + day + " days!");
      return false;
        }
      }
      return true;
}
    
function dispDate(dateObj) {
    month = dateObj.getMonth()+1;
    month = (month < 10) ? "0" + month : month;
    
    day   = dateObj.getDate();
    day = (day < 10) ? "0" + day : day;
    
    year  = dateObj.getYear();
    if (year < 2000) year += 1900;
    
    return (month + "/" + day + "/" + year);
}

// function createTable() {
//     const index = $('.drugmodal').attr('name')
//     const consultation = $('.drugmodal').attr('id')
//     $.ajax({
//         type: 'POST',
//         url: '/get-consultation',
//         data: {
//             index,
//             consultation
//         },
//         success:function (data) {
//             const drugs = data.clickedConsultation
//             $('#myModal').modal('show');
//             $('.modal-title').html(data.clickedConsultation[0].name)
//             var col = [];
//             for (var i = 0; i < drugs; i++) {
//                 for (var key in drugs[i]) {
//                     if (col.indexOf(key) === -1) {
//                         col.push(key);
//                     }
//                 }
//             }

//             // CREATE DYNAMIC TABLE.
//             // var table = $("<table cellspacing='0' class='text'></table>");
//             // $.append(t);
//             var table = document.createElement("table");

//             // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.

//             var tr = table.insertRow(-1);                   // TABLE ROW.

//             for (var i = 0; i < col.length; i++) {
//                 var th = document.createElement("th");      // TABLE HEADER.
//                 th.innerHTML = col[i];
//                 tr.appendChild(th);
//             }

//             // ADD JSON DATA TO THE TABLE AS ROWS.
//             for (var i = 0; i < drugs.length; i++) {

//                 tr = table.insertRow(-1);

//                 for (var j = 0; j < col.length; j++) {
//                     var tabCell = tr.insertCell(-1);
//                     tabCell.innerHTML = drugs[i][col[j]];
//                 }
//             }

//             // FINALLY ADD THE NEWLY CREATED TABLE WITH JSON DATA TO A CONTAINER.
//             var divContainer = document.getElementById("showData");
//             divContainer.innerHTML = "";
//             divContainer.appendChild(table);
//             // $.each(data.clickedConsultation, function(index, value){
                
//             //     $("#table").append($("<td>",{
//             //             text: value.date,
//             //             text: value.drugs,
//             //             text: value.dose,
//             //             text: value.frequency,
//             //             text: value.duration,
//             //             text: value.total,
//             //             text: value.price,
//             //             text: value.note
//             //     }))
//             // })
        
//         }
//     })
// }
    
function pregnancyCalc() {
    let lmp = $('#lmp').val();
    var ecc = '';
    var luteala = '';
    menstrual = new Date(); // creates new date objects
    ovulation = new Date();
    duedate = new Date();
    today = new Date();
    cycle = 0, luteal = 0; // sets variables to invalid state ==> 0
    
    if (isValidDate(lmp)) { // Validates menstual date 
    menstrualinput = new Date(lmp);
    menstrual.setTime(menstrualinput.getTime())
    }
    else return false; // otherwise exits
    
    cycle = (ecc == "" ? 28 : ecc); // defaults to 28
    // // validates cycle range, from 22 to 45
    if (ecc != "" && (ecc < 22 || ecc > 45)) {
    alert("Your cycle length is either too short or too long for \n"
    + "calculations to be very accurate!  We will still try to \n"
    + "complete the calculation with the figure you entered. ");
    }
    
    luteal = (luteala == "" ? 14 : luteala); // defaults to 14
    // // validates luteal range, from 9 to 16
    if (luteala != "" && (luteala < 9 || luteala > 16)) {
    alert("Your luteal phase length is either too short or too long for \n"
    + "calculations to be very accurate!  We will still try to complete \n"
    + "the calculation with the figure you entered. ");
    }
    
    // sets ovulation date to menstrual date + cycle days - luteal days
    // the '*86400000' is necessary because date objects track time
    // in milliseconds;  86400000 milliseconds equals one day
    ovulation.setTime(menstrual.getTime() + (cycle*86400000) - (luteal*86400000));
    $('#ecc').val(dispDate(ovulation))
    // pregform.conception.value = dispDate(ovulation);
    
    // sets due date to ovulation date plus 266 days
    duedate.setTime(ovulation.getTime() + 266*86400000);
    $('#edd').val(dispDate(duedate))
    // pregform.duedate.value = dispDate(duedate);
    
    // sets fetal age to 14 + 266 (pregnancy time) - time left
    var fetalage = 14 + 266 - ((duedate - today) / 86400000);
    weeks = parseInt(fetalage / 7); // sets weeks to whole number of weeks
    days = Math.floor(fetalage % 7); // sets days to the whole number remainder
    
    // fetal age message, automatically includes 's' on week and day if necessary
    fetalage = weeks + " week" + (weeks > 1 ? "s" : "") + ", " + days + " days";
    $('#fetalage').val(fetalage)
    // pregform.fetalage.value = fetalage;
    
    return false; // form should never submit, returns false
}


// function appointmentType() {
//     let appointmenttype = $('#appointmenttype').val()
//     if(appointmenttype === 'Ante-Natal'){
//         $('#doc').hide()
//     }else{
//         $('#doc').show()
//     }
// }

//Search function
function myFunction() {
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    table = document.getElementById("myTable");
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("td")[0];
      if (td) {
        txtValue = td.textContent || td.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        }
      }       
    }
  }


  


//Getting the drug prescriptions
