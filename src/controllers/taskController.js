import conect from "../config/bd.js";

export async function criarTarefa(req, res) {
  try {
    const { titulo, descricao } = req.body;
    if (!titulo) {
      return res.status(400).json({ error: "Título é obrigatório!" });
    }
    const [result] = await conect.query(
      "INSERT INTO tasks (titulo, descricao) VALUES (?, ?)",
      [titulo, descricao || null],
    );
    res
      .status(201)
      .json({ id: result.insertId, titulo, descricao, completada: false });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message });
  }
}

export async function listarTarefas(req, res) {
  try {
    const [pegarTarefas] = await conect.query(
      "SELECT * FROM tasks ORDER BY id",
    );
    res.json(pegarTarefas);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message });
  }
}

export async function atualizarTarefa(req, res) {
  try {
    const { id } = req.params;
    const { titulo, descricao, completada } = req.body;

    const [existeTarefa] = await conect.query(
      "SELECT * FROM tasks WHERE id = ?",
      [id],
    );
    if (existeTarefa.length === 0) {
      return res.status(404).json({ error: "Tarefa não encontrada!" });
    }

    const atual = existeTarefa[0];
    await conect.query(
      "UPDATE tasks SET titulo = ?, descricao = ?, completada = ? WHERE id = ?",
      [
        titulo ?? atual.titulo,
        descricao ?? atual.descricao,
        completada ?? atual.completada,
        id,
      ],
    );
    res.json({ mensagem: "Tarefa atualizada com sucesso!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}

export async function deletarTarefa(req, res) {
  try {
    const { id } = req.params;
    const [resultado] = await conect.query("DELETE FROM tasks WHERE id = ?", [
      id,
    ]);
    if (resultado.affectedRows === 0) {
      return res.status(404).json({ error: "Tarefa não encontrada!" });
    }
    res.json({ mensagem: "Tarefa removida com sucesso!" });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message });
  }
}
