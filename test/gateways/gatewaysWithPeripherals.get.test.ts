process.env.NODE_ENV = "test";

import chai from "chai";
import chaiHttp from "chai-http";
import app from "../../src/app";
import Gateway from "../../src/model/gateway.model";
import Peripheral from "../../src/model/peripheral.model";

chai.use(chaiHttp);

describe("Gateways with peripherals", () => {
  const g1 = {
    serialNumber: "1234",
    name: "Gateway 1",
    ipv4Address: "255.0.0.0",
  };

  const p1 = {
    vendor: "vendor 1",
    status: "offline",
  };

  const p2 = {
    vendor: "vendor 2",
    status: "online",
  };

  beforeEach(async () => {
    //Before each test we empty the database
    await Gateway.deleteMany({});
    await Peripheral.deleteMany({});

    const gateway = await Gateway.create(g1);

    // Creating two peripherals attached to this gateway
    await Peripheral.create({ ...p1, gateway: gateway._id });

    await Peripheral.create({ ...p2, gateway: gateway._id });
  });

  describe("/GET gateway with peripherals", () => {
    it("it should GET one gateway", (done) => {
      chai
        .request(app)
        .get("/api/gatewaysWithPeripherals")
        .end((err, res) => {
          res.body[0].should.include(g1);
          res.body[0].peripherals[0].should.include(p1);
          res.body[0].peripherals[1].should.include(p2);
          done();
        });
    });
  });
});
