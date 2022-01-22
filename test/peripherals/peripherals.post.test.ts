process.env.NODE_ENV = "test";

import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import app from "../../src/app";
import Gateway from "../../src/model/gateway.model";
import Peripheral from "../../src/model/peripheral.model";

chai.use(chaiHttp);

describe("/POST peripheral", () => {
  beforeEach((done) => {
    //Before each test we empty the database
    Peripheral.deleteMany({}, (err: any) => {
      done();
    });
  });

  it("it should not POST a peripheral without vendor field", (done) => {
    let peripheral = {
      uid: 1234,
      // vendor: "Vendor 1",
      status: "online",
    };
    chai
      .request(app)
      .post("/api/peripherals")
      .send(peripheral)
      .end((err, res) => {
        res.body.path.should.equal("body.vendor");
        done();
      });
  });

  it("it should not POST a peripheral with an status", (done) => {
    let peripheral = {
      uid: 1234,
      vendor: "Vendor 1",
      status: "invalid status",
    };
    chai
      .request(app)
      .post("/api/peripherals")
      .send(peripheral)
      .end((err, res) => {
        res.body.path.should.equal("body.status");
        done();
      });
  });

  describe("Test attaching peripheral mote than 10 to gateway", () => {
    beforeEach(async () => {
      await Gateway.deleteMany({});
      await Peripheral.deleteMany({});

      const gateway = await Gateway.create({
        serialNumber: "4121",
        name: "Gateway 1",
        ipv4Address: "255.0.0.0",
      });

      new Array(10).fill(0).map(async (p) => {
        const w = await Peripheral.create({
          vendor: "Vendor 1",
          gateway: gateway._id,
        });
      });
    });

    it("it should not POST a peripheral attached to a gateway with 10 pheripherals already attached", async () => {
      let gateway = await Gateway.findOne({}).lean();
      let peripheral = {
        uid: 1234,
        vendor: "Vendor 1",
        status: "offline",
        gateway: gateway ? gateway._id : null,
      };

      chai
        .request(app)
        .post("/api/peripherals")
        .send(peripheral)
        .end((err, res) => {
          res.should.have.status(400);
        });
    });
  });

  it("it should POST a peripheral successfully", (done) => {
    let peripheral = {
      uid: 1234,
      vendor: "Vendor 1",
      status: "offline",
    };
    chai
      .request(app)
      .post("/api/peripherals")
      .send(peripheral)
      .end(async (err, res) => {
        res.body.should.be.a("object");
        const peripheralInDb = await Peripheral.findOne({
          _id: res.body._id,
        }).lean();
        expect(peripheralInDb).includes(peripheral);
        done();
      });
  });
});
