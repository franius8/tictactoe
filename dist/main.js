(()=>{"use strict";var e,t,n,r,i,a,d,l,u,o,c,s,m,p,f,v,y,C,b,E,h,A,g,x,B,k,L,w,I,M,P,q=function(e,t){return{name:e,marker:t,selectField:function(e){var n=parseInt(e.getAttribute("index"));return null===T.getBoard()[n]?(T.addMarker(n,t),function(e){var n=document.createElement("div");n.classList.add(t),e.appendChild(n)}(e),!0):(F.displayTakenMessage(),!1)}}},S=(e=0,t=null,n=null,r=1,i=null,a=function(){t=n[0],F.displayCurrentPlayer(t),document.querySelectorAll(".field").forEach((function(e){e.addEventListener("click",(function(){d(e)}))}))},d=function(e){if("computer"!==t.name&&!0===t.selectField(e)){if(!0===T.isWon())return void o(!1);if(9===r)return void o(!0);r+=1,u()}},l=function(){t=n[0],F.displayCurrentPlayer(t),document.querySelectorAll(".field").forEach((function(e){e.addEventListener("click",(function(){d(e)}))}))},u=function(){e=Math.abs(e-1),t=n[e],F.displayCurrentPlayer(t),"computer"===t.name&&setTimeout((function(){D.selectField(i),!0===T.isWon()&&o(!1),r+=1,u()}),1e3)},o=function(e){e?F.displayTieMessage():F.displayWinner(t.name),document.querySelectorAll(".field").forEach((function(e){var t=e.cloneNode(!0);e.parentNode.replaceChild(t,e)})),F.displayResetButton()},{initializeGame:function(e,t){n=[q(e,"x"),q(t,"o")],F.displayBoard(T.getBoard()),F.addDisplayDivs(),a()},initializePvCGame:function(e,t){n=[q(e,"x"),D],i=t,F.displayBoard(T.getBoard()),F.addDisplayDivs(),l()},getCurrentPlayerMarker:function(){return t.marker},resetGame:function(){e=0,t=null,n=null,r=1,T.resetBoard(),F.hideBoard(),F.displayInitialButtons()}}),D=(c=null,s=null,m=function(){for(var e=!1;!1===e;){var t=Math.floor(9.99*Math.random());0!==t&&null===T.getBoard()[t]&&(y(t),e=!0)}},p=function(){f()?y(c):v()?y(s):null===T.getBoard()[5]?y(5):m()},f=function(){var e=null;return T.winningCombinations.forEach((function(t){var n=0,r=0,i=null;t.forEach((function(e){switch(T.getBoard()[e]){case"o":n+=1;break;case null:r+=1,i=e}})),2===n&&1===r&&(e=i)})),null!==e&&(c=e,!0)},v=function(){var e=null;return T.winningCombinations.forEach((function(t){var n=0,r=0,i=null;t.forEach((function(e){switch(T.getBoard()[e]){case"x":n+=1;break;case null:r+=1,i=e}})),2===n&&1===r&&(e=i)})),null!==e&&(s=e,!0)},y=function(e){var t=document.querySelector('[index="'.concat(e,'"]'));T.addMarker(e,"o");var n=document.createElement("div");n.classList.add("o"),t.appendChild(n)},{name:"computer",marker:"o",selectField:function(e){switch(e){case"easy":m();break;case"standard":p()}}}),T=(C=new Array(10).fill(null),E=function(e){return e.every(h)},h=function(e){return C[e]===S.getCurrentPlayerMarker()},{winningCombinations:b=[[1,2,3],[4,5,6],[7,8,9],[1,4,7],[2,5,8],[3,6,9],[1,5,9],[3,5,7]],getBoard:function(){return C},addMarker:function(e,t){return C[e]=t},isWon:function(){return b.some(E)},isPresent:E,resetBoard:function(){C=new Array(10).fill(null)}}),F=(A=document.getElementById("display"),g=document.getElementById("board"),x=document.getElementById("content"),B=function(){M();var e=document.createElement("button"),t=document.createElement("div"),n=document.createElement("button");e.textContent="Player vs Computer",t.textContent="or",n.textContent="Player vs Player",A.appendChild(e),A.appendChild(t),A.appendChild(n),e.addEventListener("click",(function(){k()})),n.addEventListener("click",(function(){L()}))},k=function(){M();var e=document.createElement("button");e.textContent="← Return";var t=document.createElement("form");t.setAttribute("id","form");var n=document.createElement("label");n.setAttribute("for","player1name"),n.textContent="First player's name:";var r=document.createElement("input");r.setAttribute("id","player1name"),r.setAttribute("type","text"),r.setAttribute("required","true");var i=document.createElement("label");i.setAttribute("for","radiocontainer"),i.textContent="Select difficulty:";var a=document.createElement("div");a.setAttribute("id","radiocontainer");var d=document.createElement("label");d.setAttribute("for","difficultyleveleasy"),d.textContent="Easy";var l=document.createElement("input");l.setAttribute("id","difficultyleveleasy"),l.setAttribute("type","radio"),l.setAttribute("value","easy"),l.setAttribute("required","true"),l.setAttribute("name","difficulty");var u=document.createElement("label");u.setAttribute("for","difficultylevelstandard"),u.textContent="Standard";var o=document.createElement("input");o.setAttribute("id","difficultylevelstandard"),o.setAttribute("type","radio"),o.setAttribute("value","standard"),o.setAttribute("required","true"),o.setAttribute("name","difficulty");var c=document.createElement("button");c.setAttribute("type","submit"),c.textContent="New game",a.appendChild(l),a.appendChild(d),a.appendChild(o),a.appendChild(u),t.appendChild(e),t.appendChild(n),t.appendChild(r),t.appendChild(i),t.appendChild(a),t.appendChild(c),A.appendChild(t),e.addEventListener("click",(function(){B()})),t.addEventListener("submit",(function(e){e.preventDefault();var n=document.getElementById("player1name").value,r=document.querySelector('input[name="difficulty"]:checked').value;e.target.reset(),t.remove(),S.initializePvCGame(n,r)}))},L=function(){M();var e=document.createElement("button");e.textContent="← Return";var t=document.createElement("form");t.setAttribute("id","form");var n=document.createElement("label");n.setAttribute("for","player1name"),n.textContent="First player's name:";var r=document.createElement("input");r.setAttribute("id","player1name"),r.setAttribute("type","text"),r.setAttribute("required","true");var i=document.createElement("label");i.setAttribute("for","player2name"),i.textContent="Second player's name:";var a=document.createElement("input");a.setAttribute("id","player2name"),a.setAttribute("type","text"),a.setAttribute("required","true");var d=document.createElement("button");d.setAttribute("type","submit"),d.textContent="New game",t.appendChild(e),t.appendChild(n),t.appendChild(r),t.appendChild(i),t.appendChild(a),t.appendChild(d),A.appendChild(t),e.addEventListener("click",(function(){B()})),t.addEventListener("submit",(function(e){e.preventDefault();var n=document.getElementById("player1name").value,r=document.getElementById("player2name").value;e.target.reset(),t.remove(),S.initializeGame(n,r)}))},w=function(e){var t=document.getElementById("markerdiv"),n=document.createElement("div");t.innerHTML="",n.classList.add(e.marker),t.appendChild(n)},I=function(){var e=document.getElementById("errordiv");e.textContent="",e.style.visibility="collapse"},M=function(){A.textContent=""},{displayBoard:function(e){x.style.display="grid",e.forEach((function(e,t){var n=document.createElement("div");if(n.classList.add("field"),n.setAttribute("index",t.toString()),0!==t){if("x"===e){var r=document.createElement("div");r.classList.add("x"),n.appendChild(r)}else if("o"===e){var i=document.createElement("div");i.classList.add("o"),n.appendChild(i)}g.appendChild(n)}})),g.style.display="grid"},displayCurrentPlayer:function(e){document.getElementById("currentplayerdiv").textContent=e.name,w(e),I()},displayTakenMessage:function(){var e=document.getElementById("errordiv");e.textContent="Space already taken",e.style.visibility="visible"},addDisplayDivs:function(){var e=document.createElement("div");e.setAttribute("id","errordiv");var t=document.createElement("div");t.setAttribute("id","currentplayerlabel"),t.textContent="Current player:";var n=document.createElement("div");n.setAttribute("id","currentplayercontainer");var r=document.createElement("div");r.setAttribute("id","currentplayerdiv");var i=document.createElement("div");i.setAttribute("id","markerdiv"),n.appendChild(r),n.appendChild(i),A.appendChild(e),A.appendChild(t),A.appendChild(n),P()},displayWinner:function(e){M();var t=document.createElement("div");t.textContent="".concat(e," won!"),t.classList.add("winnerdiv"),A.appendChild(t)},displayResetButton:P=function(){var e=document.createElement("button");e.setAttribute("id","resetbutton"),e.textContent="New game",A.appendChild(e),e.addEventListener("click",(function(){S.resetGame()}))},hideBoard:function(){x.style.display="flex",g.textContent="",g.style.display="none"},displayTieMessage:function(){M();var e=document.createElement("div");e.textContent="Tie",e.classList.add("winnerdiv"),A.appendChild(e)},displayInitialButtons:B});F.displayInitialButtons()})();