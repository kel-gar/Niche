const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/topics";

const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;
const Flair = require("../../src/db/models").Flair;

describe("routes : flair", () => {

  beforeEach((done) => {
    this.topic;
    this.flair;

    sequelize.sync({force: true}).then((res) => {
      Topic.create({
        title: "Winter Games",
        description: "Post your Winter Games stories."
      })
      .then((topic) => {
        this.topic = topic;

        Flair.create({
          name: "Popular Post",
          color: "Green",
          topicId: this.topic.id
        })
        .then((flair) => {
          this.flair = flair;
          done();
        })
        .catch((err) => {
          console.log(err);
          done();
        });
      });
    });

});

describe("GET /topics/:topicId/flair/new", () => {

  it("should render a new flair form", (done) => {
    request.get(`${base}/${topic.id}/flair/new`, (err, res, body) => {
      expect(err).toBeNull();
      expect(body).toContain("New Flair");
      done();
    });
  });

});

describe("POST /topics/:topicId/flair/create", () => {

  it("should create a new flair and redirect", (done) => {
     const options = {
       url: `${base}/${this.topic.id}/flair/create`,
       form: {
         name: "YouTube Video",
         color: "Orange"
       }
     };
     request.post(options,
       // should the above be post?
       (err, res, body) => {

         Flair.findOne({where: {name: "YouTube Video"}})
         .then((flair) => {
           expect(this.flair).not.toBeNull();
           expect(flair).name).toBe("YouTube Video");
           expect(flair).color).toBe("Orange");
           expect(flair.topicId).not.toBeNull();
           done();
         })
         .catch((err) => {
           console.log(err);
           done();
         });
       }
     );
   });

});

describe("GET /topics/:topicId/flair/:id", () => {

  it("should render a view with the selected flair", (done) => {
    request.get(`${base}/${this.topic.id}/posts/${this.flair.id}`, (err, res, body) => {
      expect(err).toBeNull();
      expect(body).toContain("Popular Post");
      done();
    });
  });

});

describe("POST /topics/:topicId/flair/:id/destroy", () => {

  it("should delete the flair with the associated ID", (done) => {

//#1
    expect(this.flair.id).toBe(1);

    request.post(`${base}/${this.topic.id}/flair/${this.flair.id}/destroy`, (err, res, body) => {

//#2
      Flair.findById(1)
      .then((flair) => {
        expect(err).toBeNull();
        expect(flair).toBeNull();
        done();
      })
    });
  });

});

describe("GET /topics/:topicId/flair/:id/edit", () => {

  it("should render a view with an edit flair form", (done) => {
    request.get(`${base}/${this.topic.id}/flair/${this.flair.id}/edit`, (err, res, body) => {
      expect(err).toBeNull();
      expect(body).toContain("Edit Flair");
      expect(body).toContain("Popular Post");
      done();
    });
  });

});

describe("POST /topics/:topicId/flair/:id/update", () => {

  it("should return a status code 302", (done) => {
    request.post({
      url: `${base}/${topic.id}/flair/${flair.id}/update`,
      form: {
        name: "YouTube Video",
        color: "Orange"
      }
    }, (err, res, body) => {
      expect(res.statusCode).toBe(302);
      done();
    });
  });

  it("should update the flair with the given values", (done) => {
      const options = {
        url: `${base}/${this.topic.id}/flair/${this.flair.id}/update`,
        form: {
          name: "YouTube Video"
        }
      };
      request.post(options,
        (err, res, body) => {

        expect(err).toBeNull();

        Flair.findOne({
          where: {id: this.flair.id}
        })
        .then((flair) => {
          expect(flair.name).toBe("YouTube Video");
          done();
        });
      });
  });

});


});
