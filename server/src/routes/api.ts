import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

export default function (prisma: PrismaClient) {
  const router = Router();

  // Flowers
  router.get('/flowers', async (req, res) => {
    const flowers = await prisma.flower.findMany({ include: { supplier: true } });
    res.json(flowers);
  });

  router.post('/flowers', async (req, res) => {
    const data = req.body;
    const flower = await prisma.flower.create({ data });
    res.json(flower);
  });

  router.put('/flowers/:id', async (req, res) => {
    const id = req.params.id;
    const data = req.body;
    const flower = await prisma.flower.update({ where: { id }, data });
    res.json(flower);
  });

  // Suppliers
  router.get('/suppliers', async (req, res) => {
    const suppliers = await prisma.supplier.findMany();
    res.json(suppliers);
  });

  router.post('/suppliers', async (req, res) => {
    const data = req.body;
    const supplier = await prisma.supplier.create({ data });
    res.json(supplier);
  });

  router.put('/suppliers/:id', async (req, res) => {
    const id = req.params.id;
    const data = req.body;
    const supplier = await prisma.supplier.update({ where: { id }, data });
    res.json(supplier);
  });

  // Sales
  router.get('/sales', async (req, res) => {
    const sales = await prisma.sale.findMany({
      include: { items: { include: { flower: true } } },
      orderBy: { sale_date: 'desc' },
      take: 50,
    });
    res.json(sales);
  });

  router.post('/sales', async (req, res) => {
    const { items, ...saleData } = req.body;

    const sale = await prisma.sale.create({ data: saleData });

    for (const it of items) {
      await prisma.saleItem.create({ data: { ...it, sale_id: sale.id, subtotal: it.quantity * it.unit_price } });
      await prisma.flower.update({ where: { id: it.flower_id }, data: { current_stock: { decrement: it.quantity } } as unknown });
      await prisma.stockMovement.create({ data: { flower_id: it.flower_id, movement_type: 'sale', quantity: -it.quantity, reference_id: sale.id, notes: `Sale #${sale.id.substring(0,8)}` } });
    }

    const saleWithItems = await prisma.sale.findUnique({ where: { id: sale.id }, include: { items: { include: { flower: true } } } });
    res.json(saleWithItems);
  });

  return router;
}
