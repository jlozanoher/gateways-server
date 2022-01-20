import { object, string } from "yup";

const params = {
  params: object({
    _id: string().required(),
  }),
};

export const createGatewaySchema = object({
  body: object({
    serialNumber: string().required(),
    name: string().required().max(50),
    ipv4Address: string()
      .required()
      .matches(
        /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
        { excludeEmptyString: true }
      ),
  }),
});

export const updateGatewaySchema = object({
  ...params,
  body: object({
    serialNumber: string(),
    name: string().max(50),
    ipv4Address: string().matches(
      /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
      { excludeEmptyString: true }
    ),
  }),
});

export const deleteGatewaySchema = object({
  ...params,
});
