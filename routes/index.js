var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Cart = require('../models/cart');
var Cart2 = require('../models/cart2');
var Category = require('../models/category');
var nodemailer = require('nodemailer');
var Book = require('../models/book');
var Order = require('../models/order');
var BStats = require('../models/bookStats');
var QStats = require('../models/qtyStats');
var PStats = require('../models/productStats');
var CStats = require('../models/categoryStats');
var IncStats = require('../models/incomeStats');
var Order2 = require('../models/order2');
var Note = require('../models/note');
var SalesStats= require('../models/salesStats');
const keys = require('../config1/keys')
const stripe = require('stripe')('sk_test_IbxDt5lsOreFtqzmDUFocXIp0051Hd5Jol');
var xlsx = require('xlsx')
var multer = require('multer')
const fs = require('fs')
var path = require('path');
var passport = require('passport');
var moment = require('moment')
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const jwt = require('jsonwebtoken');
const JWT_KEY = "jwtactive987";
const JWT_RESET_KEY = "jwtreset987";
/*const connectEnsureLogin = require('connect-ensure-login')*/


var storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./public/uploads/')
    },
    filename:(req,file,cb)=>{
        cb(null,file.originalname)
    }
})



var upload = multer({
    storage:storage
})








router.get('/', function (req, res, next) {
  var messages = req.flash('error');
  
  res.render('login', { messages: messages, hasErrors: messages.length > 0});
});
router.post('/', passport.authenticate('local.signin', {
  failureRedirect: '/',
  failureFlash: true,
  successRedirect:'/orderVI'
})
)



router.get('/orderVI',isLoggedIn, function(req,res){
  let ord6 =[]
  var id = req.user._id
  User.find({_id:id},  function(err,nocs){
 
let num = nocs[0].num
  

  Order.find({},function(err,docs){
var size = docs.length - 1

let cart=[]
   let cart2=[]
   let prop = []
    for(var i = 0; i<docs.length;i++){
   




  // cart.push(docs[i].cart)
   //console.log(cart.length)
  

   cart2.push(docs[i].cart)
   let name = docs[i].buyerName
   let mobile = docs[i].buyerMobile
  
   if(i == size){
    console.log(cart2.length, 'cart length')
   for(var x=0;x<cart2.length;x++){
     
     let properties = Object.keys(cart2[x].items);
     //console.log(properties.length,'properties length'+ x)
     //console.log(properties,'properties'+ x)
let sz = properties.length - 1
    for(var c = 0; c<properties.length;c++){
      prop.push(properties[c])
      //console.log(properties[c])
      if(c == sz){
       // console.log(properties[c])
       // prop.push(properties[c])
//console.log(properties +'index'+ x)
//console.log(prop,'prop')
//console.log(prop.length)
//console.log(prop.length,'outta loop')
//console.log(prop,'prop')
//console.log(prop.length,'prop length')

let psize= Object.keys(cart2[x].items)
//psize.push(Object.keys(cart2[x].items))
//console.log(psize.length,'psize length')
let psizeX = psize.length




let count = -1
for(num;num<prop.length;num++){
count++
//console.log(num,'n')
//console.log(count, 'count')

if(count <=psizeX){

  ord6.push(cart2[x].items[prop[num]])
  //console.log(x+'x'+ 'n'+ num)

 //console.log(cart2[x].items[prop[n]],'zvinobuda')
 User.findByIdAndUpdate(id,{$set:{num:num}},  function(err,docs){
 

 })
 
}
else if (count>psizeX){
break;

}
 
  
 //console.log(count,'count')
 // console.log(cart2[x].items[prop[n]],'zvafa'+ n)
 // console.log(cart2[x].items[prop[n]],'zvafa'+ n)
// ord6.push(cart2[x].items[prop[n]])
 //console.log(cart2[x].items[prop[x]].item)
 
}


}

//console.log(cart2[x].items[prop[c]],'zvafa'+ x)
    }

//
   }
   //console.log(ord6.length, 'length')
   //console.log(ord6)
   console.log(ord6.length,'length')
 
   for(var q=0;q<ord6.length;q++){
  
  
  let ord = new Order2()
  

  ord.category = ord6[q].item.category
  ord.author = ord6[q].item.author
  ord.id = ord6[q].item._id
  ord.price = ord6[q].item.price
  ord.buyerName = name
  ord.buyerMobile = mobile
  ord.qty = ord6[q].qty
  ord.code=ord6[q].item.code
  ord.title=ord6[q].item.title
  ord.barcodeNumber = ord6[q].item.barcodeNumber

  ord.date = ord6[q].date

  ord.save()

   }
 
   
}

    }



    res.redirect('/user')
  })
 
})

})

router.get('/user',isLoggedIn,function(req,res){
  var id = req.user._id
  Order2.find({},function(err,nocs){
   console.log(nocs.length,'size'+'user')
      let size = nocs.length
  User.findByIdAndUpdate(id,{$set:{num:size}},function(err,doc){
if(!err){
res.redirect('/pstats')
}
})
    
  })

})

router.get('/pstats',isLoggedIn,function(req,res){
  Order2.find({},function(err,docs){
    for(var i = 0; i<docs.length;i++){
      let id = docs[i].id;
      let title= docs[i].title
      let code = docs[i].code
      let category = docs[i].category
   

      
     
        PStats.find({id:id},function(err,tocs){
        let size = tocs.length
     
        if(tocs == 0){
          let ord = new PStats()

          ord.title =title
          ord.code=code
       
          ord.id =id
          ord.qty = 0
          ord.category = category
         
      
          ord.save()

        }
       

      })
   
    }
    res.redirect('/pup')
  })
})


    
router.get('/pup',function(req,res){
  PStats.find({},function(err,docs){
    for(var i = 0;i<docs.length;i++){
      let id = docs[i].id
      PStats.find({id:id},function(err,nocs){
        if(nocs.length > 1){
          PStats.findByIdAndRemove(nocs[1]._id, function(err,tocs){

          })
        }
      })
    }
    res.redirect('/pstats2')
  })
})





router.get('/pstats2',function(req,res){
 
  Order2.find({},function(err,docs){
    for(var i = 0; i<docs.length;i++){
      let title = docs[i].title
      let code = docs[i].code
      let id = docs[i].id

      Order2.find({ id:id},function(err,tocs){
        let arr=[]
        for(var c = 0;c<tocs.length; c++){
          arr.push(tocs[c].qty)
            }
       let total=0;
        for(var c in arr) { total += arr[c]; }
      
        //subtracting total income from amount owing
       console.log(total,'total',id)


       PStats.find({id:id},function(err,locs){
console.log(id,'id')
        if(locs.length >= 1){
          let id2 = locs[0]._id
          PStats.findByIdAndUpdate(id2,{$set:{qty:total}},function(err,kocs){

          })
        }



       })
      })
     
    }
    res.redirect('/cstats')
  })
})





router.get('/cstats',isLoggedIn,function(req,res){
  Order2.find({},function(err,docs){
    for(var i = 0; i<docs.length;i++){

      let category = docs[i].category

      let code = docs[i].code

      
     
        CStats.find({category:category},function(err,tocs){
        let size = tocs.length
     
        if(tocs.length == 0){
          let ord = new CStats()

        
         
          ord.qty = 0
          ord.category = category
      
          ord.code= code
          ord.save()

        }
       

      })
    
    }
    res.redirect('/cup')
  })
})



    
router.get('/cup',function(req,res){
  CStats.find({},function(err,docs){
    for(var i = 0;i<docs.length;i++){
      let category = docs[i].category
      CStats.find({category:category},function(err,nocs){
        if(nocs.length > 1){
          for(var a = 1;a<nocs.length;a++){
          CStats.findByIdAndRemove(nocs[a]._id, function(err,tocs){

          })
        }
        }
      })
    }
    res.redirect('/cstats2')
  })
})





router.get('/cstats2',function(req,res){
 
  Order2.find({},function(err,docs){
    for(var i = 0; i<docs.length;i++){

      let category = docs[i].category

      Order2.find({category:category},function(err,tocs){
        let arr=[]
        for(var c = 0;c<tocs.length; c++){
          arr.push(tocs[c].qty)
            }
       let total=0;
        for(var c in arr) { total += arr[c]; }
      
        //subtracting total income from amount owing
       console.log(total,'total')


       CStats.find({category:category},function(err,locs){

        if(locs){
          let id2 = locs[0]._id
          CStats.findByIdAndUpdate(id2,{$set:{qty:total}},function(err,kocs){

          })
        }



       })
      })
 
    }
    res.redirect('/user2')
  })
})



router.get('/user2',isLoggedIn,function(req,res){
  var id = req.user._id
  Order2.find({},function(err,nocs){
   console.log(nocs.length,'size'+'user2')
      let size = nocs.length
  User.findByIdAndUpdate(id,{$set:{num:size}},function(err,doc){
if(!err){
res.redirect('/dash')
}
})
    
  })

})

//category Chart 

router.post('/categoryChart', function(req,res){

        CStats.find({},function(err,docs){
          if(docs == undefined){
            res.redirect('/')
          }else
      
             res.send(docs)
         
          
           })
      
      })



      router.post('/productChart', function(req,res){

        PStats.find({},function(err,docs){
          if(docs == undefined){
            res.redirect('/')
          }else
      
             res.send(docs)
         
          
           })
      
      })




      router.get('/dash',isLoggedIn,function(req,res){
        var pro = req.user
        Note.find({},function(err,docs){

      
          res.render('index',{pro:pro,list:docs})
        })
      })



      router.get('/msg',function(req,res){
        res.render('inbox')
      })


      router.get('/comp',function(req,res){
        res.render('compose')
      })


router.get('/reply',function(req,res){
  res.render('reply')
})

router.get('/add',function(req,res){

  var pro = req.user
  Note.find({},function(err,docs){


    res.render('admit',{pro:pro,list:docs})
  })
 
})

router.post('/add', function(req,res){
  var m = moment()
                  var year = m.format('YYYY')
                  
                var name = req.body.name
                var surname = req.body.surname
                var mobile = req.body.mobile
                var email = req.body.email
                var password = req.body.password
                req.check('name','Enter Name').notEmpty();
                req.check('surname','Enter Surname').notEmpty();
              
                req.check('email','Enter email').notEmpty().isEmail();
         
                
             
                req.check('mobile', 'Enter Phone Number').notEmpty();
                req.check('password', 'Password do not match').isLength({min: 4}).equals(req.body.confirmPassword);
                    
                
                      
                   
                var errors = req.validationErrors();
                    if (errors) {
                
                    
                      req.session.errors = errors;
                      req.session.success = false;
                      res.render('admit',{ errors:req.session.errors,})
                      
                    
                  }
                  else
                
                 {
                    User.findOne({'email':email})
                    .then(user =>{
                        if(user){ 
                      // req.session.errors = errors
                        //req.success.user = false;
                    
                       req.session.message = {
                         type:'errors',
                         message:'user id already in use'
                       }     
                       
                          res.render('admit', {
                              message:req.session.message,    }) 
                       
                        
                  }
                  
                                else  {   
               

                  
                  var user = new User();
                  user.fullname = name +" "+ surname;
                  user.email = email;
                  user.mobile = mobile;
                  user.photo = 'propic.jpg';
                  user.role = 'clerk';
                  user.num = 0
                  user.category = 'null'

          
                  
                  
                  user.password = user.encryptPassword(password)

                  
                   
              
                   
          
                  user.save()
                    .then(user =>{
                      
                })
              }
            
                    })
                  }
              
                 
                
                    
                    
                
                 
                  

                  
})














router.get('/notify',isLoggedIn, function(req,res){
  res.render('notifs')
})

router.post('/notify',isLoggedIn, function(req,res){
  var m = moment()
                  var year = m.format('YYYY')
                  
                var subject = req.body.subject
                var message = req.body.message
                var role = req.user.role
                var user = req.user.fullname
           
                console.log(role,'role')
                req.check('subject','Enter Subject').notEmpty();
                req.check('message','Enter Message').notEmpty();
              
               
                    
                
                      
                   
                var errors = req.validationErrors();
                    if (errors) {
                
                    
                      req.session.errors = errors;
                      req.session.success = false;
                      res.render('notifs',{ errors:req.session.errors,})
                      
                    
                  }
                  else{

              
              
                  var not = new Note();
                  not.role = role
                  not.subject = subject;
                  not.message = message
                  not.status = 'null';
                  not.status1 = 'null';
                  not.user = user;
                  not.type = 'null'
                 

          
                  
                  
               

                  
                   
              
                   
          
                  not.save()
                    .then(user =>{
                      
                })

              }
                              

                  
})






router.get("/logout", (req, res) => {
  req.logout(req.user, err => {
    if(err) return next(err);
    res.redirect("/");
  });
});

  
  
//

router.get('/dash',isLoggedIn, function(req,res){
  var pro = req.user
  res.render('index',{pro:pro})
}) 

router.get('/info', isLoggedIn,function(req,res){
  var pro = req.user
  res.render('book',{pro:pro})
})



router.post('/info',isLoggedIn, upload.single('file'),function(req,res){
  var pro = req.user
  var title = req.body.title

  var category = req.body.category
  var code = req.body.code
  var price = req.body.price
        req.check('title','Enter Book Title').notEmpty();
            
               req.check('code','Enter Book Code').notEmpty();
               req.check('price','Enter Book Price').notEmpty();
               req.check('category', 'Enter Category').notEmpty();

               var errors = req.validationErrors();
  
        if(!req.file){

            req.session.message = {
              type:'errors',
              message:'Select File!'
            }     
              res.render('book', {message:req.session.message,pro:pro
           
               })
              }
             
                else if (errors) {
            
                     req.session.errors = errors;
                     req.session.success = false;
                     res.render('book',{ errors:req.session.errors,pro:pro})
              
                 }

                 else
                 {
                  Book.findOne({'code':code, 'barcodeNumer':barcode})
                  .then(bk =>{
                      if(bk){ 
                    // req.session.errors = errors
                      //req.success.user = false;
                  
                     req.session.message = {
                       type:'errors',
                       message:'code/book already in the system'
                     }     
                     
                        res.render('admit', {
                            message:req.session.message, pro:pro   }) 
                     
                      
                }
                
                              else  {   
             

        
              
          
                const imageFile = req.file.filename;
        
                var book = new Book();
                  book.title = title
                  book.category = category
                  book.barcodeNumber = 'null'
                  book.code = code
                  book.filename = imageFile;
                  book.author = 'null'
                  book.quantity = 0
                  book.description = 'null'
                  book.user = req.user.fullname
                  book.rate = 0
                  book.zwl = 0
                  book.price = price
                      
                       
                        book.save()
                          .then(title =>{
                          
                            req.session.message = {
                              type:'success',
                              message:'Book added'
                            }  
                            res.render('book',{message:req.session.message,pro:pro});
                          
                        
                        })
                         
                        
                      }
                        })
                      }
                        
                         });

  

                         router.get('/viewBooks',isLoggedIn, (req, res) => {
                          var pro = req.user
                          Book.find({},(err, docs) => {
                              if (!err) {
                                  res.render("list3", {
                                     list:docs,pro:pro
                                    
                                  });
                              }
                          });
                          });


router.get('/addStock',isLoggedIn,function(req,res){
  var pro = req.user
  res.render('stock',{pro:pro})
})




router.post('/addStock',isLoggedIn, function(req,res){
  var pro = req.user
  var code = req.body.code;
  var title = req.body.title;
  var author = req.body.author;
  var category = req.body.category
  var qty = req.body.quantity
 var barcodeNumber = req.body.barcodeNumber

  req.check('code','Enter Book Code').isNumeric();
  req.check('title','Enter Book Title').isString().notEmpty();
  req.check('author','Enter Book Author').notEmpty();
  req.check('quantity','Enter Quantity').notEmpty();
 
  

  
  
  var errors = req.validationErrors();
   
  if (errors) {

    req.session.errors = errors;
    req.session.success = false;
    res.render('stock',{ errors:req.session.errors,pro:pro})
    
  
  }
  else
Book.findOne({'code':code})
.then(bk =>{

    if(bk){ 



      
  Book.find({code:code},function(err,doc){
    id = doc[0]._id
    console.log(id)
    Book.findByIdAndUpdate(id,{$set:{quantity:qty, barcodeNumber:barcodeNumber}},function(err,loc){
        if(!err){
        
        }
    })
    res.redirect('/addStock')
  

    })
  }else

    req.session.message = {
      type:'errors',
      message:'Book does not exists'
    }   

    res.render('stock',{
      message:req.session.message,pro:pro
    })
  


})

})



router.get('/viewStock',isLoggedIn, (req, res) => {
  var pro = req.user
  Book.find({},(err, docs) => {
      if (!err) {
          res.render("list", {
             list:docs,pro:pro
            
          });
      }
  });
  });


  router.get('/verify',isLoggedIn,function(req,res){
    var pro = req.user
    res.render('verify',{pro:pro})
  })


  router.post('/verifyScan',function(req,res){
  
    var barcodeNumber = req.body.code
     Order2.find({barcodeNumber:barcodeNumber},function(err,docs){
    if(docs == undefined){
      res.redirect('/verify')
    }else
    console.log(docs,'docs')
   
       res.send(docs[0])
     })
   })
   

  //Autocomplete for student details when recording school fees
  router.get('/autocompleteX/',isLoggedIn, function(req, res, next) {
    var code

      var regex= new RegExp(req.query["term"],'i');
     
      var bookFilter =Book.find({},{'code':1}).sort({"updated_at":-1}).sort({"created_at":-1}).limit(20);
    
      
      bookFilter.exec(function(err,data){
     
   
    console.log('data',data)
    
    var result=[];
    
    if(!err){
       if(data && data.length && data.length>0){
         data.forEach(book=>{
   
          
       
    
            
           let obj={
             id:book._id,
             label: book.code
  
         
       
         
           
            
    
             
           };
          
           result.push(obj);
        
       
         });
    
       }
     
       res.jsonp(result);
  
      }
    
    })
   
    });
  
  //role admin
//this route autopopulates info of the title selected from the autompleteX route
    router.post('/autoX',isLoggedIn,function(req,res){
        var code = req.body.code

    
        
       
        Book.find({code:code},function(err,docs){
       if(docs == undefined){
         res.redirect('/')
       }else
      
          res.send(docs[0])
        })
      
      
      })
 
      

      router.get('/invoice', isLoggedIn,function(req,res){
        var pro = req.user
        var successMsg = req.flash('success')[0];
        res.render('create',{successMsg: successMsg, noMessages: !successMsg,pro:pro})
      })
      
      router.get('/viewSales',isLoggedIn, (req, res) => {
        var pro = req.user
        Order2.find({},(err, docs) => {
            if (!err) {
                res.render("list2", {
                   list:docs,pro:pro
                  
                });
            }
        });
        });
      
      router.get('/add-to-cart/:id', function(req, res, next) {
      //console.log(req.body['name[]'],'robga')
      var m = moment()
      var date = moment().toString();
      var cart = new Cart(req.session.cart ? req.session.cart : {});
      var productId = req.params.id
      var quantity = req.query.code
       let arr, arr1, arr2, name,  price 
        arr = req.body['name[]']
        arr1 = req.body['quantity[]']
        arr2=req.body['price[]']
        arr3=req.body['id[]']
        //console.log(arr,'arr',arr1,'arr1',arr2,'arr2',arr3,'arr3')
      /*
        for(var i = 0; i< arr.length - 1; i++){
          console.log(arr[i],'name') 
          for(var n = 0; n<arr1.length - 1; n++){
           // let quantity = arr1[n]
            console.log(arr1[n],'quantity')
            for(var c = 0; c < arr2.length - 1; c++){
              //let price = arr2[c]
              console.log(arr2[c],'price')
             // cart.add(name, '33', quantity, price);
              //console.log(name,quantity,price,'hei')
      
            }
          }
        }*/
  
      
      
   
 
        var total
      
        
      var qty = arr1

    
        Book.findById(productId, function(err, product) {
           if (err) {
               return res.redirect('/sec');
           }
           cart.add(product, product.id, quantity,  date);
            req.session.cart = cart;
            //console.log(product,'product')
          //  console.log(productId,'productId')
       res.send(cart)
            
        });
      
    
      });
      
      
    
    

router.get('/invoiceX',function(req,res){
//console.log(req.query.code)
var num = req.query.code
console.log(num,'num')
 num++
 var num1 = num++
console.log(num1,'++')
var num2 =[]
num2.push(num1)

Book.find({},function(err,docs){

  res.send(num2);
  
})
 /* let arr, arr1, arr2, name, qty, price = []
  arr = req.body['name[]']
  arr1 = req.body['quantity[]']
  arr2=req.body['price[]']
  console.log(arr,'arr',arr1,'arr1',arr2,'arr2' + 'mhata')*/
})








      router.get('/autocompleteXN/', function(req, res, next) {
        var code
    
          var regex= new RegExp(req.query["term"],'i');
         
          var bookFilter =Book.find({},{'title':1}).sort({"updated_at":-1}).sort({"created_at":-1}).limit(20);
        
          
          bookFilter.exec(function(err,data){
         
       
        console.log('data',data)
        
        var result=[];
        
        if(!err){
           if(data && data.length && data.length>0){
             data.forEach(book=>{
       
              
           
        
                
               let obj={
                 id:book._id,
                 label: book.title
      
             
           
             
               
                
        
                 
               };
              
               result.push(obj);
            
           
             });
        
           }
         
           res.jsonp(result);
      
          }
        
        })
       
        });
      
      //role admin
    //this route autopopulates info of the title selected from the autompleteX route
        router.post('/autoXN',function(req,res){
            var code = req.body.code
    
        
            
           
            Book.find({title:code},function(err,docs){
           if(docs == undefined){
             res.redirect('/')
           }else
          
              res.send(docs[0])
            })
          
          
          })
     
          
    


          router.post('/checkout',isLoggedIn,  function(req, res, next) {
            if (!req.session.cart) {
                return res.redirect('/cart');
            }
            var cart = new Cart(req.session.cart);
            
            var stripe = require("stripe")(
                "sk_test_IbxDt5lsOreFtqzmDUFocXIp0051Hd5Jol"
            );
        var id =req.user._id;
        var email = req.user.email
        var fullname = req.user.fullname
        var mobile = req.user.mobile
           
        
            stripe.charges.create({
                amount: cart.totalPrice * 100,
                currency: "usd",
                source:  "tok_mastercard", // obtained with Stripe.js
                description: "Test Charge"
            }, function(err, charge) {
                if (err) {
               
                    console.log(err.message)
                    console.log(req.body.slot,'ma1')
                    return res.redirect('/cart');
                }
                var order = new Order({
                   
        
                  
                 
                  cart : cart,
                  email: email,
                  buyerName: fullname,
                  buyerMobile: mobile,
                  userId :id,
                  amount :cart.totalPrice
                });
                order.save(function(err, result) {
                  
        
        let ord6 =[]
        var id = req.user._id
        User.find({_id:id},  function(err,nocs){
        
        let num = nocs[0].num
        
        
        Order.find({},function(err,docs){
        var size = docs.length - 1
        
        let cart=[]
         let cart2=[]
         let prop = []
          for(var i = 0; i<docs.length;i++){
         
        
        
        
        
        
         cart2.push(docs[i].cart)
         let name = docs[i].buyerName
         let mobile = docs[i].buyerMobile
        
         if(i == size){
          console.log(cart2.length, 'cart length')
         for(var x=0;x<cart2.length;x++){
           
           let properties = Object.keys(cart2[x].items);
          
        let sz = properties.length - 1
          for(var c = 0; c<properties.length;c++){
            prop.push(properties[c])
         
            if(c == sz){
        
        
        let psize= Object.keys(cart2[x].items)
        
        let psizeX = psize.length
        
        
        
        
        let count = -1
        for(num;num<prop.length;num++){
        count++
        
        
        if(count <=psizeX){
        
        ord6.push(cart2[x].items[prop[num]])
        
        User.findByIdAndUpdate(id,{$set:{num:num}},  function(err,docs){
        
        
        })
        
        }
        else if (count>psizeX){
        break;
        
        }
        
        
        
        }
        
        
        }
        
          }
        
        
         }
        
         console.log(ord6.length,'length')
        
         for(var q=0;q<ord6.length;q++){
        
        
        // let ord = new Order2()
        let idV = ord6[q].item._id
        let proQty = ord6[q].qty
        Book.find({_id:idV},function(err,mocs){
        let qtyV = mocs[0].quantity
        let nqty = qtyV - proQty
        
        Book.findByIdAndUpdate(idV,{$set:{quantity:nqty}},function(err,klocs){
        
        })
        })
        
        
         }
        
         
        }
        
          }
        
        
        
         
        })
        
        })
        
                    req.flash('success', 'Successfully bought product!');
                    console.log('success', 'Successfully bought product!');
                    req.session.cart = null;
                    res.redirect('/invoice');
                });
            }); 
        });



function encryptPassword(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);  
};

  module.exports = router;

  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    else{
        res.redirect('/')
    }
  }
  
    
    