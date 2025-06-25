const express = require("express");
const multer = require("multer");
const cors = require("cors");
//const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const jwt=require("jsonwebtoken");
const { Admin } = require("mongodb");
const app = express();
const fs = require('fs');
const path = require("path");
const bcrypt = require('bcrypt');
require('dotenv').config();

const uri = process.env.MONGO_URL;
const JWT_SECRET = process.env.JWT_SECRET;

async function insertDefaultVenues() {
  const venueNames = [
    "CCC",
    "Auditorium",
    "OAT",
    "SSL",
    "NSL",
    "Aryabhata",
    "Bhaskara"
  ];

  for (const name of venueNames) {
    const exists = await VenueBooking.findOne({ venueName: name });
    if (!exists) {
      await new VenueBooking({ venueName: name, dateArray: [] }).save();
      console.log(`Inserted venue: ${name}`);
    } else {
      console.log(`Venue already exists: ${name}`);
    }
  }
}

const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async() => {console.log("MongoDB connected");await insertDefaultVenues();})
.catch(err => console.error(err));
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

app.get('/',(req,res)=>{
    res.send("hey how are yoy can you, hear mey");
    console.log("this is america")
})

const storage=multer.diskStorage({
  destination:(req,file,cb)=>{
    cb(null,uploadDir);
  },
  filename:(req,file,cb)=>{
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    cb(null,`poster_${timestamp}${ext}`)
  }
})
const upload =multer ({storage:storage});

app.use('/uploads',express.static(uploadDir));


app.post('/uploadPoster', upload.single('poster'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }

  const fileUrl = `http://localhost:7000/uploads/${req.file.filename}`;
  res.json({
    success: true,
    message: 'Poster uploaded successfully!',
    fileUrl
  });
});

const eventSchema =new mongoose.Schema({
  id:{type:Number,required:true},
  organisationName:{type:String,required:true},
  eventName:{type:String,required:true},
  date:{type:String,required:true},
  startTime:{type:String,required:true},
  endTime:{type:String,required:true},
  venue:{type:String,required:true},
  poster:{type:String,required:true},
  description:{type:String,required:true},
  maxParticipants:{type:String,required:false},
  regFee:{type:String,required:false},
  noOfparticipants:{type:Number,required:false},
  students:[],
  status:{type:String,required:true},

});

const notifSchema = new mongoose.Schema({
  message: { type: String },
  type: String,
  seen: { type: Boolean, default: false },
  event:[eventSchema],
  createdAt: {
    type: Date,
    default: Date.now 
  }
});
const StudentSchema=new mongoose.Schema({
  email:{type:String,required:true},
  rollnumber:{type:String,required:true},
  password:{type:String,required:true},
  interested:{type:Array,default:[]},
  registered:{type:Array,default:[]},
  notifications: [notifSchema]

});
const Event = mongoose.model("Event",eventSchema);

const OrganiserSchema=new mongoose.Schema({
 
  email: { type: String, required: true },
  organisationName: { type: String, required: true },
  password: { type: String, required: true },
  events: { type: Array, default: [] },
  notifications: [notifSchema]
});



const Organiser = mongoose.model("Organiser",OrganiserSchema);



const Student = mongoose.model("Student", StudentSchema);
const slotSchema = new mongoose.Schema({
  startTime: { type: String, required: true }, 
  endTime: { type: String, required: true }   
});

const dateSchema = new mongoose.Schema({
  date: { type: String, required: true },      
  slots: [slotSchema]
});
const venueSchema = new mongoose.Schema({
  venueName: { type: String, required: true, unique: true },
  dateArray: [dateSchema]
});

const VenueBooking = mongoose.model("VenueBooking", venueSchema);
app.post("/organizer/signup",(async(req,res)=>{
  try{
     let check=await Organiser.findOne({email:req.body.email.toLowerCase()});
     if(check){
      return res.status(400).json({success:false,message:"User with this email already exists"})
     }
     const userpassword=req.body.password;
     const hashedPassword = await bcrypt.hash(userpassword, 10);
     const user =new Organiser({
      email:req.body.email.toLowerCase(),
      organisationName:req.body.orgName.toLowerCase(),
      password:hashedPassword,
      events:[],
     })
     await user.save();
     const data={
      user:{
        id:user.id
      }
     }
     const token=jwt.sign(data,JWT_SECRET);
     res.json({success:true,token})
    
  }
  catch(error){
          console.error(error);
        res.status(500).json({ success: false, errors: "Server error" });
  }
}));

app.post("/organizer/login", async (req, res) => {
  try {
    const user = await Organiser.findOne({ email: req.body.email.toLowerCase()});

    if (!user) {
      return res.status(400).json({ success: false, message: "Such user doesn't exist" });
    }

    if (req.body.orgName.toLowerCase() !== user.organisationName) {
      return res.status(400).json({ success: false, message: "Organisation name is incorrect" });
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Password is incorrect" });
    }
    const data = {
      user: {
        id: user.id
      }
    };

    const token = jwt.sign(data,JWT_SECRET);
    return res.json({ success: true, token });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, errors: "Server error" });
  }
});

const fetchUser=async(req,res,next)=>{
    const token=req.header('auth-token');
    if(!token){
        return res.status(401).json({errors:"please authenticate with valid token"})
    }
    try{
        const data=jwt.verify(token,JWT_SECRET);
        req.user=data.user;
        next();
    }
    catch(error){
        res.status(401).json({ errors: "Please authenticate with a valid token" });
    }
}
app.post("/addEvent", fetchUser, async (req, res) => {
  try {
    let userData = await Organiser.findById(req.user.id);

    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
      const latestEvent = await Event.findOne().sort({ id: -1 }).limit(1);
    const nextId = latestEvent ? latestEvent.id + 1 : 1;
    const event = new Event({
      id:nextId,
      organisationName: userData.organisationName,
      eventName: req.body.EventName,
      date: req.body.date,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      poster: req.body.posterFile,
      venue: req.body.venue,
      description: req.body.description,
      maxParticipants: req.body.maxParticipants,
      regFee: req.body.registrationFee,
      noOfparticipants:0,
      student:[],
      status: req.body.status
    });

    await event.save(); 
    const venueBook = await VenueBooking.findOne({ venueName: event.venue });
   const evd=event.date;
   const st =event.startTime
   const ed=event.endTime

if (!venueBook) {
  return res.status(404).json({ success: false, message: "Venue not found" });
}

const dateEntry = venueBook.dateArray.find(dateObj => dateObj.date === evd);

if (dateEntry) {
  dateEntry.slots.push({ st, ed });
} else {
  venueBook.dateArray.push({
    date: evd,
    slots: [{ startTime:st, endTime:ed }]
  });
}
await venueBook.save();
await Organiser.findByIdAndUpdate(
      req.user.id,
      { $push: { events: event._id} },
      { new: true }
    );

    res.json({ success: true, message: "Event added successfully", eventId:event.id });

  } catch (error) {
    console.error("Error adding event:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});
app.post("/admin/login",async(req,res)=>{
  try{
   if (req.body.email !== process.env.ADMIN_EMAIL) {
      return res.status(400).json({ success: false, message: "Wrong email" });
    }

    if (req.body.password !== process.env.ADMIN_PASSWORD) {
      return res.status(400).json({ success: false, message: "Wrong password" });
    }
      const data = {
      user: {
        id: "admin"  
      }
    };
    const token = jwt.sign(data, JWT_SECRET);
    res.json({ success: true, token });
  }
  catch(error){
    console.error("Error adding event:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
})

const fetchAdmin=async(req,res,next)=>{
    const token=req.header('auth-token');
    if(!token){
        return res.status(401).json({errors:"please authenticate with valid token"})
    }
    try{
        const data=jwt.verify(token,JWT_SECRET);
        req.user=data.user;
        next();
    }
    catch(error){
        res.status(401).json({ errors: "Please authenticate with a valid token" });
    }
}

app.get("/admin/get-pending",fetchAdmin, async (req, res) => {
  try {
   const events = await Event.find({ status: "pending" });
      res.json({
      success: true,
      message: "Pending events received",
      events
    });

  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});
app.post("/approve", fetchAdmin, async (req, res) => {
  try {
    const eventId = req.body.id;

    const event = await Event.findByIdAndUpdate(
      eventId,
      { $set: { status: "approved" } },
      { new: true }
    );

    if (!event) {
      return res.status(400).json({ success: false, message: "Event not found" });
    }


    await Organiser.findOneAndUpdate(
      { organisationName: event.organisationName },
      {
        $push: {
          notifications: {
            message: `Your event "${event.eventName}" has been approved.`,
            type: "event",
            seen: false,
            event:event,
            createdAt: new Date()
          }
        }
      }
    );
     console.log("Notification push attempted");
    await Student.updateMany(
      {},
      {
        $push: {
          notifications: {
            message: `Your event "${event.eventName}" is upcoming. Do register.`,
            type: "event",
            seen: false,
            event:event,
            createdAt: new Date()
          }
        }
      }
    );

 res.json({ success: true, message: "Event approved", event });

  } catch (error) {
    console.error("Error approving event:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

app.post("/reject", fetchAdmin, async (req, res) => {
  try {
    const eventId = req.body.id;

    const event = await Event.findByIdAndUpdate(
      eventId,
      { $set: { status: "rejected" } },
      { new: true } 
    );

    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }
        await Organiser.findOneAndUpdate(
      { organisationName: event.organisationName },
      {
        $push: {
          notifications: {
            message: `Your event "${event.title}" has been approved.`,
            type: "event",
            seen: false,
            event:event,
            createdAt: new Date()
          }
        }
      }
    );


    return res.status(200).json({ success: true, message: "Event rejected", event });
  } catch (error) {
    console.error("Error rejecting event:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

app.get("/admin/get-approved",fetchAdmin, async (req, res) => {
  try {
   const events = await Event.find({ status: "approved" });
     return res.status(200).json({
      success: true,
      message: "Pending events received",
      events
    });

  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

app.get("/organizer/pending", fetchUser, async (req, res) => {
  try {
    const organizer = await Organiser.findById(req.user.id);
    const eventIds = organizer.events;

    const allEvents = await Promise.all(eventIds.map(id => Event.findById(id)));

    const today = new Date();
    const todayDateOnly = new Date(today.toISOString().split("T")[0]);

    const pendingEvents = allEvents.filter(event => {
      if (!event || event.status !== "pending") return false;

      const eventDate = new Date(event.date);
      return eventDate >= todayDateOnly;
    });

    return res.json({
      success: true,
      message: "Past approved events received",
      pendingEvents,
    });

  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});


app.get("/organizer/active", fetchUser, async (req, res) => {
  try {
    const organizer = await Organiser.findById(req.user.id);
    const eventIds = organizer.events;

    const allEvents = await Promise.all(eventIds.map(id => Event.findById(id)));

    const today = new Date();
    const todayDateOnly = new Date(today.toISOString().split("T")[0]); 
    
    const ApprovedEvents = allEvents.filter(event => {
      if (!event || event.status !== "approved") return false;

      const eventDate = new Date(event.date); 
      return eventDate >= todayDateOnly;
    });

    res.json({
      success: true,
      message: "Past approved events received",
      ApprovedEvents,
    });

  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});
app.get("/organiserName", fetchUser, async (req, res) => {
  try {
    const organizer = await Organiser.findById(req.user.id);

    if (!organizer) {
      return res.status(404).json({ success: false, message: "Organizer not found" });
    }

    const name = organizer.organisationName;
    res.json({ success: true, message: "received", name });

  } catch (error) {
    console.error("Error fetching organizer name:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});


app.get("/organizer/past", fetchUser, async (req, res) => {
  try {
    const organizer = await Organiser.findById(req.user.id);
    const eventIds = organizer.events;

    const allEvents = await Promise.all(eventIds.map(id => Event.findById(id)));

    const today = new Date();
    const todayDateOnly = new Date(today.toISOString().split("T")[0]); 

    const pastApprovedEvents = allEvents.filter(event => {
      if (!event || event.status !== "approved") return false;

      const eventDate = new Date(event.date); 
      return eventDate < todayDateOnly;
    });

    return res.status(200).json({
      success: true,
      message: "Past approved events received",
      pastApprovedEvents,
    });

  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});
app.post("/student/signup",async(req,res)=>{
  try{
  const user = await Student.findOne({email:req.body.email.toLowerCase()})
  if(user){
    return res.status(400).json({success:false,message:"User with this email already exists"});
   }
   const userpassword=req.body.password;
  const hashedPassword = await bcrypt.hash(userpassword, 10);
   const st= new Student({
    email:req.body.email.toLowerCase(),
    rollnumber:req.body.rollNo.toLowerCase(),
    password:hashedPassword,
    interested:[],
    registered:[]
   })
   await st.save();
   const data={
    user:{
      id:st.id
    }
   }
   const token = jwt.sign(data,JWT_SECRET);
   res.json({success:true,message:"signup as student successful",token});
  }

catch (error) {
    console.error("Error signing up student:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }

})

app.post("/student/login",async(req,res)=>{
  const user = await Student.findOne({email:req.body.email.toLowerCase()});
  if(!user){
   return res.status(400).json({success:false,message:"the user with this email does not exists"})
  }
   const isMatch = await bcrypt.compare(req.body.password, user.password);
  if(!isMatch){
     return res.status(400).json({success:false,message:"the password is wrong"})
  }
  
   if(user.rollnumber!==req.body.rollNo.toLowerCase()){
     return res.status(400).json({success:false,message:"the rollnumber is wrong"})
  }
  const data={
    user:{
      id:user.id
    }
  }
  const token =jwt.sign(data,JWT_SECRET);
  res.json({success:true,message:"log in is successgul",token})

});

const fetchStudent =async(req,res,next)=>{
    const token=req.header('auth-token');
    if(!token){
        return res.status(401).json({errors:"please authenticate with valid token"})
    }
    try{
        const data=jwt.verify(token,JWT_SECRET);
        req.user=data.user;
        next();
    }
    catch(error){
        res.status(401).json({ errors: "Please authenticate with a valid token" });
    }
}

app.get("/student/all",fetchStudent,async(req,res)=>{
   const organizers = await Organiser.find();
    if (!organizers) {
      return res.status(404).json({ success: false, message: "Organizer not found" });
    }
   
   const today=new Date();
   const todayDateOnly=new Date(today.toISOString().split("T")[0]);
   const organizerData= await Promise.all(
    organizers.map(async(org)=>{
      const events= await Promise.all(
        org.events.map(async(id)=>{
           return await Event.findById(id);
          })
      );
      const approvedEvents = events.filter((event)=>{
        if(!event||event.status!="approved") return false;
        const eventDate = new Date(event.date);
        return eventDate >= todayDateOnly;
      });
      return{
         organisationName: org.organisationName,
          email: org.email,
          approvedEvents 
      }
})

   )
   const student = await Student.findById(req.user.id);
   const interestedEvents= student.interested;
   const registeredIds=student.registered;
   res.json({success:true,message:"approved events sent",organizerData,interestedEvents,registeredIds})
    

  });  

app.post("/student/interested", fetchStudent, async (req, res) => {
  try {
    const eventId = req.body.id;

    if (!eventId) {
      return res.status(400).json({ success: false, message: "No such event exists" });
    }

    const updatedStudent = await Student.findByIdAndUpdate(
      req.user.id,
      { $push: { interested: eventId } },
      { new: true }
    );

     res.json({
      success: true,
      message: "New interested event added",
      interested: updatedStudent.interested,
    });

  } catch (error) {
    console.error("Error adding to interested list:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});
app.post("/student/remove-interested", fetchStudent, async (req, res) => {
  try {
    const eventId = req.body.id;

    if (!eventId) {
      return res.status(400).json({ success: false, message: "No such event exists" });
    }

    const updatedStudent = await Student.findByIdAndUpdate(
      req.user.id,
      { $pull: { interested: eventId } },
      { new: true }
    );

     res.json({
      success: true,
      message: "given interested event removed",
      interested: updatedStudent.interested,
    });

  } catch (error) {
    console.error("Error adding to interested list:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

app.post("/student/registered", fetchStudent, async (req, res) => {
  try {
    const eventId = req.body.id;

    if (!eventId) {
      return res.status(400).json({ success: false, message: "No such event exists" });
    }

    const updatedStudent = await Student.findByIdAndUpdate(
      req.user.id,
      { $push: { registered: eventId } },
      { new: true }
    );
  await Event.findByIdAndUpdate(
  req.body.id,
  {
    $push: { students: req.user.id },
    $inc: { noOfparticipants: 1 }
  },
  { new: true }
);


    return res.status(200).json({
      success: true,
      message: "New registered event added",
      interested: updatedStudent.registered,
    });

  } catch (error) {
    console.error("Error adding to registered list:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});
app.get("/getinterested", fetchStudent, async (req, res) => {
  try {
    const student = await Student.findById(req.user.id);
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    const today = new Date();
    const todayDateOnly = new Date(today.toISOString().split("T")[0]);

    const interestedEvents = (
      await Promise.all(
        student.interested.map(async (id) => {
          const event = await Event.findById(id);
          if (!event) return null;
          const eventDate = new Date(event.date);
          if (eventDate >= todayDateOnly) return event;
          return null;
        })
      )
    ).filter(Boolean); // Filter out nulls

    const interestedIds = student.interested;
    const registeredIds = student.registered;

    res.json({
      success: true,
      message: "Interested events fetched successfully",
      interestedEvents,
      interestedIds,
      registeredIds,
    });

  } catch (error) {
    console.error("Error fetching interested events:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

app.get("/getregistered", fetchStudent, async (req, res) => {
  try {
    const student = await Student.findById(req.user.id);
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    const today = new Date();
    const todayDateOnly = new Date(today.toISOString().split("T")[0]); // remove time component

    const registeredEvents = (
      await Promise.all(
        student.registered.map(async (id) => {
          const event = await Event.findById(id);
          if (!event) return null;

          const eventDate = new Date(event.date); 
          return eventDate >= todayDateOnly ? event : null;
        })
      )
    ).filter(Boolean);

    const interestedIds = student.interested;
    const registeredIds = student.registered;

    res.json({
      success: true,
      message: "Upcoming registered events fetched successfully",
      registeredEvents,
      registeredIds,
      interestedIds,
    });

  } catch (error) {
    console.error("Error fetching registered events:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

app.get("/gethistory", fetchStudent, async (req, res) => {
  try {
    const student = await Student.findById(req.user.id);
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    const today = new Date();
    const todayDateOnly = new Date(today.toISOString().split("T")[0]); // Truncate time

    const pastEvents = (
      await Promise.all(
        student.registered.map(async (id) => {
          const event = await Event.findById(id);
          if (!event) return null;

          const eventDate = new Date(event.date);
          return eventDate < todayDateOnly ? event : null;
        })
      )
    ).filter(Boolean); 

    res.json({
      success: true,
      message: "Past registered events fetched successfully",
      registeredEvents: pastEvents, 
      registeredIds: student.registered,
      interestedIds: student.interested,
    });

  } catch (error) {
    console.error("Error fetching registered event history:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

app.get("/getvenue", fetchUser, async (req, res) => {
  try {
    const allVenues = await VenueBooking.find(); 
    console.log(allVenues);
    res.json({
      success: true,
      message: "Venue mapping transfer successful",
      venues: allVenues,
    });
  } catch (error) {
    console.error("Error fetching venues:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching venues",
    });
  }
});

app.get("/api/student/notifications", fetchStudent, async (req, res) => {
  try {
    console.log("Fetching notifications for:", req.user);
    const student = await Student.findById(req.user.id);
    if (!student) return res.status(404).json({ error: "Student not found" });
    res.json({ notifications: student.notifications || [] });
  } catch (err) {
    console.error("Error in GET /api/student/notifications:", err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/student/notifications/seen", fetchStudent, async (req, res) => {
  const { id } = req.body;
  try {
    await Student.updateOne(
      { _id: req.user.id, "notifications._id": id },
      { $set: { "notifications.$.seen": true } }
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to mark as seen" });
  }
});

app.post("/api/student/notifications/delete", fetchStudent, async (req, res) => {
  const { id } = req.body;
  try {
    await Student.updateOne(
      { _id: req.user.id },
      { $pull: { notifications: { _id: id } } }
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete notification" });
  }
});
app.get("/api/organizer/notifications", fetchUser, async (req, res) => {
  try {
    const organiser = await Organiser.findById(req.user.id);
    if (!organiser) return res.status(404).json({ error: "Organiser not found" });
    res.json({ notifications: organiser.notifications || [] });
  } catch (err) {
    console.error("Error fetching organiser notifications:", err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/organizer/notifications/seen", fetchUser, async (req, res) => {
  const { id } = req.body;
  try {
    await Organiser.updateOne(
      { _id: req.user.id, "notifications._id": id },
      { $set: { "notifications.$.seen": true } }
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to mark as seen" });
  }
});

app.post("/api/organizer/notifications/delete", fetchUser, async (req, res) => {
  const { id } = req.body;
  try {
    await Organiser.updateOne(
      { _id: req.user.id },
      { $pull: { notifications: { _id: id } } }
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete notification" });
  }
});

app.post("/get-registered-students", fetchUser, async (req, res) => {
  try {
    const regstdIds = req.body.student; 
    
     const students = await Promise.all(
      regstdIds.map(async (id) => {
        const student = await Student.findById(id);
        return {
          email: student.email,
          rollnumber: student.rollnumber,
        };
      })
    );

    console.log(students);
    res.json({success:true, students });

  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(process.env.PORT, () => console.log("App running at port number 7000"));
