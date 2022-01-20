process.env.NODE_ENV = "test";

import chaiHttp from "chai-http";
import chai, { expect } from "chai";
import mongoose from "mongoose";
import app from "../../src/app";
import Gateway from "../../src/model/gateway.model";

let should = chai.should();

chai.use(chaiHttp);

describe("/POST gateway", () => {
  beforeEach((done) => {
    //Before each test we empty the database
    Gateway.remove({}, (err: any) => {
      done();
    });
  });

  it("it should not POST a gateway without serialNumber field", (done) => {
    let gateway = {
      name: "Gateway 1",
      // serialNumber: "1234",
      ipv4Address: "255.0.0.0",
    };
    chai
      .request(app)
      .post("/api/gateways")
      .send(gateway)
      .end((err, res) => {
        res.body.path.should.equal("body.serialNumber");
        done();
      });
  });

  it("it should not POST a gateway with an invalid Ipv4 address", (done) => {
    let gateway = {
      name: "Gateway 1",
      serialNumber: "1234",
      ipv4Address: "2551.0.0.0",
    };
    chai
      .request(app)
      .post("/api/gateways")
      .send(gateway)
      .end((err, res) => {
        res.body.path.should.equal("body.ipv4Address");
        done();
      });
  });

  it("it should POST a gateway successfully", (done) => {
    let gateway = {
      name: "Gateway 1",
      serialNumber: "1234",
      ipv4Address: "0.0.0.0",
    };
    chai
      .request(app)
      .post("/api/gateways")
      .send(gateway)
      .end(async (err, res) => {
        res.body.should.be.a("object");
        const gatewayInDb = await Gateway.findOne({ _id: res.body._id }).lean();
        expect(gatewayInDb).includes(gateway);
        done();
      });
  });
});
