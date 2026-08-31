import { criarTarefa, listarTarefas, atualizarTarefa, deletarTarefa } from "../controllers/taskController.js";
import { Router } from "express";

const router = Router();

router.post("/", criarTarefa);
router.get("/", listarTarefas);
router.put("/:id", atualizarTarefa);
router.delete("/:id", deletarTarefa);

export default router;
