const reportModel = require("../models/reportModel");

const reportTopic = async (req, res, next) => {
  try {
    const { id } = req.params; //id du topic
    const { reason } = req.body;
    const reporterId = req.user?.id || req.user?.userId;

    if (!reason || reason.trim() === '') {
      return res.status(400).json({ message: "Le motif du signalement est obligatoire" });
    }
    const report = await reportModel.createTopicReport(reporterId, id, reason);
    res.status(201).json({
      message: "Sujet signalé avec succès à l'équipe de modération",
      report,
    });
  } catch (error) {
    next(error);
    console.error("❌ reportTopic error:", error);
  }
};

const reportPost = async (req, res, next) => {
  try {
    const { id } = req.params; // ID du post
    const { reason } = req.body;
    const reporterId = req.user?.id || req.user?.userId;

    if (!reason || reason.trim() === '') {
      return res.status(400).json({ message: "Le motif du signalement est obligatoire" });
    }

    const report = await reportModel.createPostReport(reporterId, id, reason);

    res.status(201).json({
      message: "Message signalé avec succès à l'équipe de modération",
      report,
    });
  } catch (error) {
    next(error);
    console.error("❌ reportPost error:", error);
  }
};

const getReportsDashboard = async (req, res, next) => {
    try {
      const reports = await reportModel.getPendingReports();
      res.status(200).json({
        success: true,
        data: reports,
      });
    } catch (error) {
      next(error);
      console.error("❌ getReportsDashboard error:", error);
    }
};

const processReport = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { action, newContent, newTitle } = req.body;

    const moderatorId = req.user.id || req.user.userId;

    // 1. Vérifier que le signalement existe
    const report = await reportModel.getReportById(id);

    if (!report) {
      return res.status(404).json({
        message: "Signalement introuvable"
      });
    }

    // 2. Vérifier si le signalement a déjà été traité
    if (report.is_resolved) {
      return res.status(400).json({
        message: "Ce signalement a déjà été traité"
      });
    }

    // 3. Vérifier que l'action demandée est valide
    if (!['censor', 'delete', 'dismiss'].includes(action)) {
      return res.status(400).json({
        message:
          "Action non valide. Les actions acceptées sont : censor, delete, dismiss"
      });
    }

    /*
     * ============================================================
     * ACTION : CENSOR
     * ============================================================
     */

    if (action === 'censor') {
      if (report.post_id) {
        await reportModel.censorPost(
          report.post_id,
          newContent || '[Contenu censuré par la modération]'
        );
      } else if (report.topic_id) {
        await reportModel.censorTopic(
          report.topic_id,
          newTitle,
          newContent || '[Contenu censuré par la modération]'
        );
      }
    }

    /*
     * ============================================================
     * ACTION : DISMISS
     * ============================================================
     *
     * Aucun changement sur le topic ou le post.
     * Le signalement sera simplement marqué comme résolu.
     */

    /*
     * ============================================================
     * ACTION : DELETE
     * ============================================================
     *
     * IMPORTANT :
     * On ne supprime pas encore le post/topic.
     *
     * On résout d'abord le signalement afin que :
     *
     *     is_resolved = true
     *
     * Ensuite, lorsque PostgreSQL fera :
     *
     *     post_id = NULL
     *
     * grâce à ON DELETE SET NULL,
     * le CHECK de la table reports sera respecté.
     */

    // 4. Résoudre le signalement
    const updatedReport = await reportModel.resolveReport(
      id,
      moderatorId
    );

    if (!updatedReport) {
      return res.status(404).json({
        message: "Impossible de résoudre le signalement"
      });
    }

    /*
     * ============================================================
     * 5. SUPPRESSION DU CONTENU
     * ============================================================
     *
     * Cette étape intervient APRÈS resolveReport().
     */

    if (action === 'delete') {
      if (report.post_id) {
        await reportModel.deletePost(report.post_id);
      } else if (report.topic_id) {
        await reportModel.deleteTopic(report.topic_id);
      }
    }

    /*
     * ============================================================
     * 6. Réponse
     * ============================================================
     */

    return res.status(200).json({
      message: "Signalement traité avec succès",
      report: updatedReport
    });

  } catch (error) {
    console.error("❌ processReport error:", error);
    next(error);
  }
};

module.exports = {
  reportTopic,
  reportPost,
  getReportsDashboard,
  processReport
};