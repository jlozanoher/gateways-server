process.env.NODE_ENV = "test";

import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import app from "../../src/app";
import Gateway from "../../src/model/gateway.model";

chai.use(chaiHttp);

describe("Db should be Not populated", () => {
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

  it("it should return No", (done) => {
    chai
      .request(app)
      .get("/api/shouldPopulate")
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.text).eq("No");
        done();
      });
  });
});
