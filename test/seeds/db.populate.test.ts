process.env.NODE_ENV = "test";

import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import app from "../../src/app";
import Gateway from "../../src/model/gateway.model";
import Peripheral from "../../src/model/peripheral.model";
import { gateways } from "../../src/seeds/gateways.seed";
import { peripherals } from "../../src/seeds/peripherals.seed";

chai.use(chaiHttp);

describe("Db will be populated succesfully", () => {
  beforeEach(async () => {
    //Before each test we empty the database
    await Gateway.deleteMany({});
    await Peripheral.deleteMany({});
  });

  afterEach(async () => {
    //Before each test we empty the database
    const gatewaysInDb = await Gateway.find({}, {}, { lean: true }).exec();
    const peripheralsInDb = await Peripheral.find(
      {},
      {},
      { lean: true }
    ).exec();

    for (let g of gatewaysInDb) {
      const g2 = gateways.find((g2) => g2._id == g._id);
      if (g2) {
        delete g2._id;
      }
      expect(g).includes(g2);
    }

    for (let p of peripheralsInDb) {
      const p2 = peripherals.find((p2) => p2._id == p._id);
      if (p2) {
        delete p2._id;
        delete p2.createdAt;
        delete p2.gateway;
      }

      expect(p).includes(p2);
    }

    await Gateway.deleteMany({});
    await Peripheral.deleteMany({});
  });
});

it("it will be populated", (done) => {
  chai
    .request(app)
    .post("/api/populate")
    .end((err, res) => {
      res.should.have.status(200);
      done();
    });
});
