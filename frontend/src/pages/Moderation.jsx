import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { getPendingReports, processReport } from "../services/reportService";
import { getTopicInformationById } from "../services/topicService";
import { getPostById } from "../services/postService";
import "./Moderation.css";
import CensorModal from "../components/modals/CensorModal";

export default function ModerationDashboard() {
  const { token } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [censoringReport, setCensoringReport] = useState(null);

  useEffect(() => {
    let isActive = true;

    (async () => {
      setLoading(true);

      try {
        const rawReports = await getPendingReports(token);

        const enrichedReports = await Promise.all(
          (rawReports || []).map(async (report) => {
            const reportId = report.id || report.report_id || report.id_report;

            try {
              if (report.post_id) {
                const post = await getPostById(report.post_id);
                return { ...report, id: reportId, targetData: post };
              } else if (report.topic_id) {
                const topic = await getTopicInformationById(report.topic_id);
                return { ...report, id: reportId, targetData: topic };
              }
            } catch (err) {
              console.error(`Erreur chargement cible pour signalement ${reportId}:`, err);
            }
            return { ...report, id: reportId };
          })
        );

        if (isActive) setReports(enrichedReports);
      } catch (err) {
        if (isActive) setError(err.message);
      } finally {
        if (isActive) setLoading(false);
      }
    })();

    return () => {
      isActive = false;
    };
  }, [token]);

  const handleAction = async (report, action) => {
    if (!report?.id) {
      alert("Erreur : l'identifiant du signalement est introuvable.");
      return;
    }

    if (action === "censor") {
      setCensoringReport(report); // Ouvre la modale avec le rapport complet
      return;
    }

    try {
      await processReport(report.id, { action }, token);
      setReports((prev) => prev.filter((r) => r.id !== report.id));
    } catch (err) {
      alert(err.message);
    }
  };

  // Soumission depuis la modale de censure
  const handleConfirmCensor = async ({ newContent, newTitle }) => {
    if (!censoringReport) return;

    try {
      await processReport(
        censoringReport.id,
        { action: "censor", newContent, newTitle },
        token
      );
      setReports((prev) => prev.filter((r) => r.id !== censoringReport.id));
      setCensoringReport(null); // Ferme la modale
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div className="admin-status">Chargement des signalements...</div>;
  if (error) return <div className="form-error">{error}</div>;

  return (
    <div className="page-wrapper">
      <h1 className="page-title">Tableau de bord de modération</h1>

      {reports.length === 0 ? (
        <p>Aucun signalement en attente. Tout est propre ! 🎉</p>
      ) : (
        <div className="reports-list">
          {reports.map((report) => {
            const isPost = Boolean(report.post_id);
            const target = report.targetData;
            const targetAuthor = target?.author || "Auteur inconnu";

            // Données pour un Message (Post)
            const postContent = target?.content || report.post_content;

            // Données pour un Sujet (Topic)
            const topicTitle = target?.title || report.topic_title;
            const topicContent = target?.content || target?.description || report.topic_content;

            return (
              <div key={report.id} className="report-card">
                <div className="report-header">
                  <span className="report-type">
                    {isPost ? "Message" : "Sujet"} #{report.post_id || report.topic_id}
                  </span>

                  <span className="report-date">
                    Signalé le :{" "}
                    {new Date(report.created_at).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>

                  <span className="report-author">
                    par : <strong>{report.reporter_username || "Membre"}</strong>
                  </span>
                </div>

                <div className="report-body">
                  <p><strong>Motif :</strong> {report.reason}</p>

                  <div className="report-target-content">
                    <strong>Contenu incriminé (par {targetAuthor}) :</strong>

                    {isPost ? (
                      <p className="report-text-body">
                        {postContent || "Contenu introuvable ou supprimé"}
                      </p>
                    ) : (
                      <div className="topic-report-preview">
                        <p className="topic-report-title">
                          <strong>Titre :</strong> {topicTitle || "Sans titre"}
                        </p>
                        {topicContent && (
                          <p className="topic-report-body">
                            <strong>Message initial :</strong> {topicContent}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="report-actions">
                  <button
                    onClick={() => handleAction(report, "dismiss")}
                    className="btn btn-secondary"
                  >
                    Ignorer
                  </button>
                  <button
                    onClick={() => handleAction(report, "censor")}
                    className="btn btn-warning"
                  >
                    Censurer
                  </button>
                  <button
                    onClick={() => handleAction(report, "delete")}
                    className="btn btn-danger"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 👈 Modale placée EN DEHORS de la liste / de la boucle map */}
      {censoringReport && (
        <CensorModal
          report={censoringReport}
          onClose={() => setCensoringReport(null)}
          onSubmit={handleConfirmCensor}
        />
      )}
    </div>
  );
}