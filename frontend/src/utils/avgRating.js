export default function GetAvgRating(ratingArr = []) {
  console.log("rateeeeee : ",ratingArr)
  if (!Array.isArray(ratingArr) || ratingArr.length === 0) {
    return 0;
  }

  const total = ratingArr.reduce(
    (sum, r) => sum + Number(r.rating || 0),
    0
  );

  return Number((total / ratingArr.length).toFixed(2));
}
