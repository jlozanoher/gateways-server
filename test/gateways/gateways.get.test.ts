process.env.NODE_ENV = "test";

import chai from "chai";
import chaiHttp from "chai-http";
import app from "../../src/app";
import Gateway from "../../src/model/gateway.model";

chai.use(chaiHttp);

describe("Gateways", () => {
  beforeEach((done) => {
    //Before each test we empty the database
    Gateway.deleteMany({}, (err: any) => {
      done();
    });
  });

  describe("/GET gateway empty array", () => {
    it("it should GET 0 gateways", (done) => {
      chai
        .request(app)
        .get("/api/gateways")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
          res.body.length.should.be.eql(0);
          done();
        });
    });
  });

  describe("/GET gateway 1 object in array", () => {
    const gateway = {
      serialNumber: "1234",
      name: "Gateway 1",
      ipv4Address: "255.0.0.0",
    };
    beforeEach((done) => {
      Gateway.create(gateway, () => {
        done();
      });
    });
    it("it should GET at least one gateway", (done) => {
      chai
        .request(app)
        .get("/api/gateways")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.length.should.be.eql(1);
          res.body[0].should.include(gateway);
          done();
        });
    });
  });
});
