import { Request, Response } from 'express';
import { shineRequest } from '../request';

const getInvoiceMapping = async (req: Request, res: Response) => {
  const { access_token, invoiceId } = req.query;

  try {
    const data = await shineRequest({
      method: 'GET',
      path: `/transaction_enrichment/invoice_mappings?invoiceId=${invoiceId}`,
      authorization: access_token as string,
    });
    res.status(200).send(data);
  } catch (error) {
    res.status(error.status).send({
      status: error.status,
      message: error.body.message,
    });
  }
};

export default getInvoiceMapping;
