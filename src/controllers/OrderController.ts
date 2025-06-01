import { Request, Response } from "express";
import Order from "../models/Order";
import Product from "../models/Product";
import InventoryItem from "../models/InventoryItem";

export class OrderController {
  static getAllOrders = async (req: Request, res: Response): Promise<void> => {
    try {
      const { status } = req.query;

      const filter: any = {};
      if (status) {
        filter.status = status;
      }

      const orders = await Order.find(filter)
        .populate("products.product")
        .sort({ createdAt: -1 });

      res.json(orders);
    } catch (error: any) {
      console.error("Error al obtener órdenes:", error.message);
      res.status(500).json({ message: "Error al obtener órdenes" });
    }
  };

  static getOrderById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const order = await Order.findById(id).populate("products.product");

      if (!order) {
        res.status(404).json({ message: "Orden no encontrada" });
        return;
      }

      res.json(order);
    } catch (error: any) {
      console.error("Error al obtener la orden:", error.message);
      res.status(500).json({ message: "Error al obtener la orden" });
    }
  };


static createOrder = async (req: Request, res: Response): Promise<void> => { 
  try {
    const { client, table, type, products, notas, paymethod } = req.body;

    for (const ordered of products) {
      const product = await Product.findById(ordered.product);
      if (!product) {
        res.status(404).json({ message: `Producto con ID ${ordered.product} no encontrado.` });
        return;
      }

      for (const ing of product.ingredients) {
        const totalRequired = ing.quantity * ordered.quantity;
        const item = await InventoryItem.findOne({ name: ing.name });

        if (!item || item.stock < totalRequired) {
          res.status(400).json({
            message: `No hay suficiente stock de "${ing.name}" para "${product.name}". Faltan ${totalRequired - (item?.stock || 0)} unidades.`
          });
          return;
        }
      }

      for (const extra of ordered.extras || []) {
        const item = await InventoryItem.findOne({ name: extra.name });
        if (!item || item.stock < ordered.quantity) {
          res.status(400).json({
            message: `No hay suficiente stock de extra "${extra.name}".`
          });
          return;
        }
      }
    }

    for (const ordered of products) {
      const product = await Product.findById(ordered.product);
      if (!product) continue;

      for (const ing of product.ingredients) {
        const totalRequired = ing.quantity * ordered.quantity;
        await InventoryItem.updateOne(
          { name: ing.name },
          { $inc: { stock: -totalRequired } }
        );
      }

      for (const extra of ordered.extras || []) {
        await InventoryItem.updateOne(
          { name: extra.name },
          { $inc: { stock: -ordered.quantity } }
        );
      }
    }

    let total = 0;
    for (const ordered of products) {
      const product = await Product.findById(ordered.product);
      if (!product) continue;

      const extrasTotal = (ordered.extras || []).reduce((sum: number, extra: any) => sum + (extra.price || 0), 0);
      total += (product.price + extrasTotal) * ordered.quantity;
    }

    const newOrder = await Order.create({
      client,
      table,
      type,
      products,
      total, 
      notas,
      paymethod
    });

    res.status(201).json(newOrder);
  } catch (error: any) {
    console.error("Error al crear orden:", error.message);
    res.status(500).json({ message: "Error al crear orden" });
  }
};

  static update = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { client, table, type, products, status, notas, paymethod } = req.body;

      const existingOrder = await Order.findById(id);
      if (!existingOrder) {
        res.status(404).json({ message: "Orden no encontrada" });
        return;
      }

      for (const ordered of existingOrder.products) {
        const product = await Product.findById(ordered.product);
        if (!product) continue;

        for (const ing of product.ingredients) {
          const totalToRestore = ing.quantity * ordered.quantity;
          await InventoryItem.updateOne(
            { name: ing.name },
            { $inc: { stock: totalToRestore } }
          );
        }

        for (const extra of ordered.extras || []) {
          await InventoryItem.updateOne(
            { name: extra.name },
            { $inc: { stock: ordered.quantity } }
          );
        }
      }

      for (const ordered of products) {
        const product = await Product.findById(ordered.product);
        if (!product) {
          res.status(404).json({ message: `Producto con ID ${ordered.product} no encontrado.` });
          return;
        }

        for (const ing of product.ingredients) {
          const totalRequired = ing.quantity * ordered.quantity;
          const item = await InventoryItem.findOne({ name: ing.name });
          if (!item || item.stock < totalRequired) {
            res.status(400).json({
              message: `No hay suficiente stock de "${ing.name}" para "${product.name}".`
            });
            return;
          }
        }

        for (const extra of ordered.extras || []) {
          const item = await InventoryItem.findOne({ name: extra.name });
          if (!item || item.stock < ordered.quantity) {
            res.status(400).json({
              message: `No hay suficiente stock de extra "${extra.name}".`
            });
            return;
          }
        }
      }

      for (const ordered of products) {
        const product = await Product.findById(ordered.product);
        if (!product) continue;

        for (const ing of product.ingredients) {
          const totalRequired = ing.quantity * ordered.quantity;
          await InventoryItem.updateOne(
            { name: ing.name },
            { $inc: { stock: -totalRequired } }
          );
        }

        for (const extra of ordered.extras || []) {
          await InventoryItem.updateOne(
            { name: extra.name },
            { $inc: { stock: -ordered.quantity } }
          );
        }
      }

      const updatedOrder = await Order.findByIdAndUpdate(
        id,
        { client, table, type, products, status, notas, paymethod },
        { new: true }
      );

      res.json(updatedOrder);
    } catch (error: any) {
      console.error("Error al actualizar orden:", error.message);
      res.status(500).json({ message: "Error al actualizar orden" });
    }
  };

  static delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const order = await Order.findById(id);
      if (!order) {
        res.status(404).json({ message: "Orden no encontrada" });
        return;
      }

      for (const ordered of order.products) {
        const product = await Product.findById(ordered.product);
        if (!product) continue;

        for (const ing of product.ingredients) {
          const totalToRestore = ing.quantity * ordered.quantity;
          await InventoryItem.updateOne(
            { name: ing.name },
            { $inc: { stock: totalToRestore } }
          );
        }

        for (const extra of ordered.extras || []) {
          await InventoryItem.updateOne(
            { name: extra.name },
            { $inc: { stock: ordered.quantity } }
          );
        }
      }

      await Order.findByIdAndDelete(id);

      res.json({ message: "Orden eliminada y stock reestablecido correctamente" });
    } catch (error: any) {
      console.error("Error al eliminar orden:", error.message);
      res.status(500).json({ message: "Error al eliminar orden" });
    }
  };

  static updateStatus = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status, paymethod } = req.body;

    if (!['en curso', 'pago pendiente', 'pagado'].includes(status)) {
      res.status(400).json({ message: "Estado inválido" });
      return;
    }

    const updateFields: any = { status };

    if (paymethod) {
      updateFields.paymethod = paymethod;
    }

    const updated = await Order.findByIdAndUpdate(id, updateFields, { new: true });

    res.json(updated);
  };

  static getInProgressOrders = async (req: Request, res: Response): Promise<void> => {
    try {
      const orders = await Order.find({ status: 'en curso' }).populate("products.product");
      res.json(orders);
    } catch (error: any) {
      console.error("Error al obtener órdenes en curso:", error.message);
      res.status(500).json({ message: "Error al obtener órdenes en curso" });
    }
  };

  static getPendingPaymentOrders = async (req: Request, res: Response): Promise<void> => {
    try {
      const orders = await Order.find({ status: 'pago pendiente' }).populate("products.product");
      res.json(orders);
    } catch (error: any) {
      console.error("Error al obtener órdenes de pago pendiente:", error.message);
      res.status(500).json({ message: "Error al obtener órdenes de pago pendiente" });
    }
  };

  static getPaidOrders = async (req: Request, res: Response) => {
    try {
      const orders = await Order.find({ status: "pagado" }).populate("products.product");
      res.json(orders);
    } catch (error) {
      console.error("Error al obtener órdenes pagadas:", error);
      res.status(500).json({ message: "Error al obtener órdenes pagadas" });
    }
  };

  static updatePaymentMethod = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { paymethod } = req.body;

      if (!["efectivo", "tarjeta", "transferencia", "cortesia"].includes(paymethod)) {
        res.status(400).json({ message: "Método de pago inválido" });
        return;
      }

      const updated = await Order.findByIdAndUpdate(id, { paymethod }, { new: true });

      if (!updated) {
        res.status(404).json({ message: "Orden no encontrada" });
        return;
      }

      res.json(updated);
    } catch (error: any) {
      console.error("Error al actualizar forma de pago:", error.message);
      res.status(500).json({ message: "Error al actualizar forma de pago" });
    }
  };
}
