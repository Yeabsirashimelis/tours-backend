import qs from 'qs';

export default class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const execludedFields = ['page', 'sort', 'limit', 'fields'];
    execludedFields.forEach((el) => delete queryObj[el]);

    const parsedQuery = qs.parse(queryObj); // to make the "duration[gte]=5 - API CALL" to  duration: { '$gte': '5' }- MONGOOSE LOOKALIKE
    //{difficulty:"easy", duration:{gte:"5"}} // this will be an eg which we get from our querystring
    //{difficulty:"easy", duration:{$gte:5}}// THIS IS MONGOOSE QUERY FOR INEQUALITIES. SO our querystring formated is suitable to convert

    // 1B, ADVANCED FILTERING
    //gte, gt, lte, lt
    let queryStr = JSON.stringify(parsedQuery);
    queryStr = queryStr.replace(/\b(gte|ge|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));
    // let query = Tour.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' '); //b/c "sort=price,ratingsAverage" should be like "sort=price ratingsAverage" for mongoose
      this.query = this.query.sort(sortBy);
    } else {
      //this is default if the API user doesnot specify sorting
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      //default fields limiting if the user don't specify fields
      this.query = this.query.select('-__v'); // this is the thing mongoose always return in each objects (it uses it internally).so remove it from the response
    }

    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1; //convert to number(*1 )
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}
