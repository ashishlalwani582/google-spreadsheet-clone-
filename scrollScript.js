let prevTopScroll;
let prevLeftScroll;

grid.addEventListener("scroll", function (e) {
  let currTopScroll = e.currentTarget.scrollTop;
  let currLeftScroll = e.currentTarget.scrollLeft;

  if (currTopScroll != prevTopScroll) {
    // horizontal scoll
    prevTopScroll = currTopScroll;
    rowNumbers.classList.remove("row-numbers-atke");
    columnTags.classList.add("column-tags-atke");
  } else if (currLeftScroll != prevLeftScroll) {
    prevLeftScroll = currLeftScroll;
    columnTags.classList.remove("column-tags-atke");
    rowNumbers.classList.add("row-numbers-atke ");
  } else if (
    currLeftScroll != prevLeftScroll &&
    currTopScroll != prevTopScroll
  ) {
    prevLeftScroll = currLeftScroll;
    prevTopScroll = currTopScroll;
    rowNumbers.classList.add("row-numbers-atke");
    columnTags.classList.add("column-tags-atke");
  }
});
