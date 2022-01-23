process.env.NODE_ENV = "test";

import chai from "chai";
import chaiHttp from "chai-http";
import app from "../../src/app";
import Peripheral from "../../src/model/peripheral.model";

chai.use(chaiHttp);

describe("Peripherals", () => {
  beforeEach((done) => {
    //Before each test we empty the database
    Peripheral.deleteMany({}, (err: any) => {
      done();
    });
  });

  describe("/GET peripheral empty array", () => {
    it("it should GET 0 peripherals", (done) => {
      chai
        .request(app)
        .get("/api/peripherals")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
          res.body.length.should.be.eql(0);
          done();
        });
    });
  });

  describe("/GET peripheral 1 object in array", () => {
    const peripheral = {
      vendor: "vendor 1",
      status: "offline",
    };
    beforeEach((done) => {
      Peripheral.create(peripheral, () => {
        done();
      });
    });
    it("it should GET at least one peripheral", (done) => {
      chai
        .request(app)
        .get("/api/peripherals")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.length.should.be.eql(1);
          res.body[0].should.include(peripheral);
          done();
        });
    });
  });
});
