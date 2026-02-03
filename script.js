import { db } from "./firebase.js";
import {
 collection,
 addDoc,
 getDocs,
 query,
 orderBy
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const form = document.getElementById("noteForm");
const notesContainer = document.getElementById("notesContainer");

const recipientInput = document.getElementById("recipient");
const hintInput = document.getElementById("hint");
const songInput = document.getElementById("song");
const messageInput = document.getElementById("message");
const passInput = document.getElementById("pass");

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const searchStatus = document.getElementById("searchStatus");

const notesRef = collection(db, "notes");


function isValidURL(url) {
 try {
   new URL(url);
   return true;
 } catch {
   return false;
 }
}


window.addEventListener("DOMContentLoaded", fetchNotes);


form.addEventListener("submit", async (e) => {
 e.preventDefault();

 if (!isValidURL(songInput.value.trim())) {
   alert("Please enter a valid song link (YouTube or Spotify).");
   return;
 }

 const noteData = {
   recipient: recipientInput.value,
   hint: hintInput.value,
   song: songInput.value,
   message: messageInput.value,
   pass: passInput.value
 };

 await addDoc(notesRef, noteData);
 form.reset();

 appendNoteToDOM(noteData);
});


function appendNoteToDOM(note) {
 const card = document.createElement("div");
 card.className = "note-card";

 card.innerHTML = `
   <h3>For: ${note.recipient}</h3>
   <p class="hint-label">${note.hint}</p>
   <p class="status-text"></p>
   <p class="message hidden">${note.message}</p>
   <input type="password" placeholder="Enter passcode" />
   <button class="unlock-btn">Unlock</button>
   <a class="song" href="${note.song}" target="_blank">🎵 Play song</a>
 `;

 const input = card.querySelector("input");
 const button = card.querySelector(".unlock-btn");
 const message = card.querySelector(".message");
 const statusText = card.querySelector(".status-text");

 button.addEventListener("click", () => {
   const enteredPass = input.value.trim().toLowerCase();
   const storedPass = note.pass.trim().toLowerCase();

   if (enteredPass === storedPass) {
     statusText.textContent = "Message was meant for you ! ! ";
     statusText.style.opacity = "0.7";
     message.classList.remove("hidden");
     input.remove();
     button.remove();
   } else {
     statusText.textContent = "If it feels close, try again.";
     statusText.style.opacity = "0.6";
   }
 });

 notesContainer.appendChild(card);
}


async function fetchNotes() {
 const q = query(notesRef, orderBy("recipient"));
 const snapshot = await getDocs(q);

 notesContainer.innerHTML = "";

 snapshot.forEach((doc) => {
   appendNoteToDOM(doc.data());
 });
}


searchBtn.addEventListener("click", () => {
 const query = searchInput.value.trim().toLowerCase();
 const notes = document.querySelectorAll(".note-card");

 let found = 0;

 form.style.display = "none"; 

 notes.forEach((card) => {
   const recipient = card
     .querySelector("h3")
     .textContent.replace("For:", "")
     .trim()
     .toLowerCase();

   if (recipient === query) {
     card.style.display = "block";
     found++;
   } else {
     card.style.display = "none";
   }
 });

 if (found === 0) {
   notesContainer.innerHTML = `
     <div class="note-card">
       <p class="hint-label">
         Sorry… no messages have been found for you.
       </p>
     </div>
   `;
 }
});
