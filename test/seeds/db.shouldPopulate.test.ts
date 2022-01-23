process.env.NODE_ENV = "test";

import chai, { expect } from "chai";
import app from "../../src/app";
import Gateway from "../../src/model/gateway.model";
import Peripheral from "../../src/model/peripheral.model";

describe("Db should be populated", () => {
  beforeEach(async () => {
    //Before each test we empty the database
    await Gateway.deleteMany({});
    await Peripheral.deleteMany({});
  });

  it("it should return Yes", (done) => {
    chai
      .request(app)
      .get("/api/shouldPopulate")
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.text).eq("Yes");
        done();
      });
  });
});
