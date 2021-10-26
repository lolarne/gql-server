var express = require("express");
var { graphqlHTTP } = require("express-graphql");
var { buildSchema } = require("graphql");

// GraphQL schema
var schema = buildSchema(`
    type Query {
        course(id: Int!): Course
        courses(topic: String): [Course]
        coursesTitle(title: String): [Course]
    },
    type Mutation {
        updateCourseTopic(id: Int!, topic: String!): Course
        addCourse(
          id: Int!, 
          title: String!, 
          author: String!, 
          description: String!, 
          topic: String!,
          url: String!): Course
    }
    type Course {
        id: Int
        title: String
        author: String
        description: String
        topic: String
        url: String
    }
`);

var coursesData = [
  {
    id: 1,
    title: "The Complete Node.js Developer Course",
    author: "Andrew Mead, Rob Percival",
    description:
      "Learn Node.js by building real-world applications with Node, Express, MongoDB, Mocha, and more!",
    topic: "Node.js",
    url: "https://codingthesmartway.com/courses/nodejs/",
  },
  {
    id: 2,
    title: "Node.js, Express & MongoDB Dev to Deployment",
    author: "Brad Traversy",
    description:
      "Learn by example building & deploying real-world Node.js applications from absolute scratch",
    topic: "Node.js",
    url: "https://codingthesmartway.com/courses/nodejs-express-mongodb/",
  },
  {
    id: 3,
    title: "JavaScript: Understanding The Weird Parts",
    author: "Anthony Alicea",
    description:
      "An advanced JavaScript course for everyone! Scope, closures, prototypes, this, build your own framework, and more.",
    topic: "JavaScript",
    url: "https://codingthesmartway.com/courses/understand-javascript/",
  },
];

var getCourse = function (args) {
  var id = args.id;
  return coursesData.filter((course) => {
    return course.id == id;
  })[0];
};

var getCourses = function (args) {
  if (args.topic) {
    var topic = args.topic;
    return coursesData.filter((course) => course.topic === topic);
  } else {
    return coursesData;
  }
};

//Get courses which include the argument in their titles
var getCoursesTitle = function (args) {
  if (args.title) {
    var title = args.title;
    return coursesData.filter((course) => course.title.includes(title));
  } else {
    return coursesData;
  }
};

var updateCourseTopic = function ({ id, topic }) {
  coursesData.map((course) => {
    if (course.id === id) {
      course.topic = topic;
      return course;
    }
  });
  return coursesData.filter((course) => course.id === id)[0];
};

//Add course to array
var addCourse = function ({ id, title, author, description, topic, url }) {
  coursesData.map((course) => {
    if (id, title, author, description, topic, url) {
      course.id = id;
      course.title = title;
      course.author = author;
      course.description = description;
      course.topic = topic;
      course.url = url;
      return course;
    }
  });
  return coursesData;
};

var root = {
  course: getCourse,
  courses: getCourses,
  getCoursesTitle: getCoursesTitle,
  updateCourseTopic: updateCourseTopic,
  addCourse: addCourse
};

// Create an express server and a GraphQL endpoint
var app = express();
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);
app.listen(4000, () =>
  console.log("Express GraphQL Server Now Running On localhost:4000/graphql")
);
