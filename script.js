let body = document.querySelector("body");
body.spellcheck = false;
let grid = document.querySelector(".grid");

let menuBarPtags = document.querySelectorAll(".menu-bar p");

let columnTags = document.querySelector(".column-tags");
let rowNumbers = document.querySelector(".row-numbers");
let formulaSelectCell = document.querySelector("#select-cell");

let oldCell;
let dataObj = {};

//let formulaSelectCell = document.querySelector("#select-cell");

for (let i = 0; i < menuBarPtags.length; i++) {
  menuBarPtags[i].addEventListener("click", function (e) {
    if (e.currentTarget.classList.contains("menu-bar-options-selected"))
      e.currentTarget.classList.remove("menu-bar-options-selected");
    else {
      for (let j = 0; j < menuBarPtags.length; j++) {
        if (menuBarPtags[j].classList.contains("menu-bar-options-selected"))
          menuBarPtags[j].classList.remove("menu-bar-options-selected");
        else menuBarPtags[i].classList.add("menu-bar-options-selected");
      }
    }
  });
}

for (let i = 0; i < 26; i++) {
  let div = document.createElement("div");
  div.classList.add("column-tag-cell");
  div.innerText = String.fromCharCode(65 + i);
  columnTags.append(div);
}

for (let i = 1; i <= 100; i++) {
  let div = document.createElement("div");
  div.classList.add("row-number-cell");
  div.innerText = i;
  rowNumbers.append(div);
}

for (let j = 1; j <= 100; j++) {
  let row = document.createElement("div");
  row.classList.add("row");

  for (let i = 0; i < 26; i++) {
    let cell = document.createElement("div");
    cell.classList.add("cell");
    let address = String.fromCharCode(i + 65) + j;

    cell.setAttribute("data-address", address);

    dataObj[address] = {
      value: "",
      formula: "",
      upstream: [],
      downstream: [],
    };

    cell.addEventListener("click", function (e) {
      //check kro koi ceel pehle se selecetd hai ki nahu
      if (oldCell) {
        // agar hai to deselect kro class remove krke
        oldCell.classList.remove("grid-selected-cell");
      }
      // jis cell pe click kia h.. usme class add krlo
      e.currentTarget.classList.add("grid-selected-cell");

      let cellAddress = e.currentTarget.getAttribute("data-address");

      formulaSelectCell.value = cellAddress;

      //and ab jo naya cell select hogya use save krdo old cell wali variable taki next time agr click ho kisi nye cell pr to ise deselect kr pai

      oldCell = e.currentTarget;
    });

    cell.addEventListener("input", function (e) {
      console.log(e.currentTarget.innerText);
      let address = e.currentTarget.getAttribute("data-address");
      dataObj[address].value = Number(e.currentTarget.innerText);
      dataObj[address].formula = "";

      // upstream clear krni hai

      let currCellUpstream = dataObj[address].upstream;

      for (let i = 0; i < currCellUpstream.length; i++) {
        removeFromUpstream(address, currCellUpstream[i]);
      }

      dataObj[address].upstream = [];

      //downstream ke cells ko update krna ha

      let currCellDownstream = dataObj[address].downstream;

      for (let i = 0; i < currCellDownstream.length; i++) {
        // ye bss wo element leta h jiski value change krni h
        updateDownStreamElements(currCellDownstream[i]);
      }
    });

    cell.contentEditable = true;
    row.append(cell);
  }
  grid.append(row);
}

console.log(dataObj);

// formula se input wala scene
let formulaInput = document.querySelector("#complete-formula");
formulaInput.addEventListener("change", function (e) {
  let formula = e.currentTarget.value;

  let selectedCellAddress = oldCell.getAttribute("data-address");

  dataObj[selectedCellAddress].formula = formula;

  let formulaArr = formula.split(" ");

  let elementsArray = [];

  for (let i = 0; i < formulaArr.length; i++) {
    if (
      formulaArr[i] != "+" &&
      formulaArr[i] != "-" &&
      formulaArr[i] != "*" &&
      formulaArr[i] != "/" &&
      isNaN(Number(formulaArr[i]))
    )
      elementsArray.push(formulaArr[i]);
  }

  // before settinhg up new upstream go to curr upstream and remove curr element from upstream

  let oldUpStream = dataObj[selectedCellAddress].upstream;

  for (let k = 0; k < oldUpStream.length; k++)
    removeFromUpstream(selectedCellAddress, oldUpStream[k]);

  dataObj[selectedCellAddress].upstream = elementsArray;
  for (let j = 0; j < elementsArray.length; j++) {
    addToDownStream(selectedCellAddress, elementsArray[j]);
  }

  let valObj = {};

  for (let i = 0; i < elementsArray.length; i++) {
    let formulaDependency = elementsArray[i];
    valObj[formulaDependency] = dataObj[formulaDependency].value;
  }

  for (let j = 0; j < formulaArr.length; j++) {
    if (valObj[formulaArr[j] != undefined]) {
      formulaArr[j] = valObj[formulaArr[j]];
    }
  }

  formula = formulaArr.join(" ");
  let newValue = eval(formula);

  dataObj[selectedCellAddress].value = newValue;

  let selectedCellDownstream = dataObj[selectedCellAddress].downstream;

  for (let i = 0; i < selectedCellDownstream.length; i++) {
    updateDownstreamElements(selectedCellDownstream[i]);
  }

  oldCell.innerText = newValue;
  forumlaInput.value = "";
});
function addToDownStream(tobeAdded, inWhichWeAreAdding) {
  // get downstram of the cell in which we have to add
  let reqDownStream = dataObj[inWhichWeAreAdding].downstream;

  reqDownStream.push(tobeAdded);
}

function removeFromUpstream(dependent, onWhichItIsDepending) {
  // c1=2* A1;

  // dependent = c1;
  // onWhichItIsDepending = A1;

  let newDownStream = [];
  let oldDownStream = dataObj[onWhichItIsDepending].downstream;
  for (let i = 0; i < oldDownStream.length; i++) {
    if (oldDownStream[i] != dependent) newDownStream.push(oldDownStream[i]);
  }
  dataObj[onWhichItIsDepending].downstream = newDownStream;
}

function updateDownStreamElements(elementAddress) {
  // step 1 : jis element ko update kr rahe gh unki upstream elemenst ki value lao
  let valObj = {};

  let currCellUpstream = dataObj[elementAddress].upstream;

  for (let i = 0; i < currCellUpstream.length; i++) {
    let upStreamCellAddress = currCellUpstream[i];
    let upStreamCellValue = dataObj[upStreamCellAddress].value;

    valObj[upStreamCellAddress] = upStreamCellValue;

    //valObj{a:20 , b: 20} ese dikjega jab loop over hojayega
  }

  let currFormula = dataObj[elementAddress].formula;
  //formula bss : "a1"+ "b1" itna hoga
  // is formula me spaces h ... use hm split krdeneg on basis of spaces
  // and then join krke .. eval function me pass krdeneg

  let formulaArr = currFormula.split(" ");

  for (let j = 0; j < formulaArr.length; j++) {
    if (valObj[formulaArr[j]]) {
      formulaArr[j] = valObj[formulaArr[j]];
    }
  }
  currFormula = formulaArr.join("");

  let newValue = eval(currFormula);

  dataObj[elementAddress].valObj = newValue;

  //upadte on ui

  let cellOnUI = document.querySelector(`[data-address=${elementAddress}]`);
  cellOnUI.inneText = newValue;

  // rec call krna h
  let currCellDownstream = dataObj[elementAddress].downstream;
  if (!currCellDownstream.length) {
    for (let k = 0; k < currCellDownstream.length; k++) {
      updateDownStreamElements(currCellDownstream[k]);
    }
  }
}

// -- ahsish lalwani