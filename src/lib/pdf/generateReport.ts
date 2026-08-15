import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { CampaignWithCalculations } from "@/types";
import { getPlatformLabel, getStatusLabel } from "@/lib/utils";
import { formatPercentage, formatNumber, formatCurrency } from "@/lib/calculations";

export async function generateCampaignPDF(campaign: CampaignWithCalculations): Promise<void> {
  const container = document.createElement("div");
  container.style.cssText = `
    position: fixed; left: -9999px; top: 0;
    width: 794px; background: #0a0a0a; color: #e5e5e5;
    font-family: 'Inter', 'Segoe UI', sans-serif; padding: 40px;
    box-sizing: border-box;
  `;

  const cpl = campaign.cpl;
  const costPerSql = campaign.costPerSql;
  const mqlRate = campaign.mqlRate;
  const sqlRate = campaign.sqlGlobalRate;
  const sqlFromMql = campaign.sqlFromMqlRate;
  const nqRate = campaign.nqRate;

  container.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 32px; border-bottom: 2px solid #EAB308; padding-bottom: 20px;">
      <div>
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="width: 40px; height: 40px; background: #EAB308; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
            <span style="color: #000; font-weight: 900; font-size: 18px;">LP</span>
          </div>
          <div>
            <h1 style="margin: 0; font-size: 13px; color: #EAB308; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;">LeadPulse Analytics</h1>
            <p style="margin: 2px 0 0; font-size: 10px; color: #888;">Rapport de Performance Campagne</p>
          </div>
        </div>
      </div>
      <div style="text-align: right;">
        <p style="margin: 0; font-size: 10px; color: #888;">Date du rapport</p>
        <p style="margin: 2px 0 0; font-size: 13px; color: #fff; font-weight: 600;">${new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })}</p>
      </div>
    </div>

    <div style="margin-bottom: 28px;">
      <h2 style="margin: 0 0 4px; font-size: 22px; color: #fff; font-weight: 700;">${campaign.name}</h2>
      <div style="display: flex; align-items: center; gap: 16px; margin-top: 8px;">
        <span style="font-size: 12px; color: #888; font-family: monospace;">${campaign.campaignId}</span>
        <span style="display: inline-block; padding: 3px 10px; border-radius: 12px; font-size: 11px; font-weight: 600; background: rgba(234, 179, 8, 0.15); color: #EAB308;">${getStatusLabel(campaign.status)}</span>
        <span style="display: inline-block; padding: 3px 10px; border-radius: 12px; font-size: 11px; font-weight: 600; background: rgba(255,255,255,0.08); color: #ccc;">${getPlatformLabel(campaign.platform)}</span>
      </div>
    </div>

    <div style="margin-bottom: 28px;">
      <h3 style="margin: 0 0 12px; font-size: 14px; color: #EAB308; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">Stratégie & Copy</h3>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
        <div style="padding: 12px; background: #121212; border-radius: 8px; border: 1px solid #222;">
          <p style="margin: 0 0 4px; font-size: 10px; color: #888; text-transform: uppercase;">Plateforme</p>
          <p style="margin: 0; font-size: 13px; color: #fff; font-weight: 600;">${getPlatformLabel(campaign.platform)}</p>
        </div>
        <div style="padding: 12px; background: #121212; border-radius: 8px; border: 1px solid #222;">
          <p style="margin: 0 0 4px; font-size: 10px; color: #888; text-transform: uppercase;">Audience Cible</p>
          <p style="margin: 0; font-size: 13px; color: #fff; font-weight: 600;">${campaign.targetAudience || campaign.cible || "—"}</p>
        </div>
        <div style="padding: 12px; background: #121212; border-radius: 8px; border: 1px solid #222;">
          <p style="margin: 0 0 4px; font-size: 10px; color: #888; text-transform: uppercase;">Angle Créatif</p>
          <p style="margin: 0; font-size: 13px; color: #fff; font-weight: 600;">${campaign.angle}</p>
        </div>
        <div style="padding: 12px; background: #121212; border-radius: 8px; border: 1px solid #222;">
          <p style="margin: 0 0 4px; font-size: 10px; color: #888; text-transform: uppercase;">CTA</p>
          <p style="margin: 0; font-size: 13px; color: #fff; font-weight: 600;">${campaign.callToAction || "—"}</p>
        </div>
      </div>
      <div style="margin-top: 12px; padding: 12px; background: #121212; border-radius: 8px; border: 1px solid #222;">
        <p style="margin: 0 0 4px; font-size: 10px; color: #888; text-transform: uppercase;">Message Principal</p>
        <p style="margin: 0; font-size: 12px; color: #ccc; line-height: 1.6;">${campaign.message}</p>
      </div>
      ${campaign.destinationUrl ? `
      <div style="margin-top: 12px; padding: 12px; background: #121212; border-radius: 8px; border: 1px solid #222;">
        <p style="margin: 0 0 4px; font-size: 10px; color: #888; text-transform: uppercase;">URL de Destination</p>
        <p style="margin: 0; font-size: 12px; color: #EAB308;">${campaign.destinationUrl}</p>
      </div>` : ""}
    </div>

    <div style="margin-bottom: 28px;">
      <h3 style="margin: 0 0 12px; font-size: 14px; color: #EAB308; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">Résumé de Performance</h3>
      <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
        <thead>
          <tr style="border-bottom: 2px solid #333;">
            <th style="padding: 10px 8px; text-align: left; color: #888; font-weight: 600; text-transform: uppercase; font-size: 10px;">Métrique</th>
            <th style="padding: 10px 8px; text-align: right; color: #888; font-weight: 600; text-transform: uppercase; font-size: 10px;">Valeur</th>
          </tr>
        </thead>
        <tbody>
          <tr style="border-bottom: 1px solid #222;">
            <td style="padding: 10px 8px; color: #ccc;">Budget Consommé (Spend)</td>
            <td style="padding: 10px 8px; text-align: right; color: #fff; font-weight: 700;">${formatCurrency(campaign.spend)} $</td>
          </tr>
          <tr style="border-bottom: 1px solid #222;">
            <td style="padding: 10px 8px; color: #ccc;">Coût Par Lead (CPL)</td>
            <td style="padding: 10px 8px; text-align: right; color: #fff; font-weight: 700;">${cpl} $</td>
          </tr>
          <tr style="border-bottom: 1px solid #222;">
            <td style="padding: 10px 8px; color: #ccc;">Coût Par SQL</td>
            <td style="padding: 10px 8px; text-align: right; color: #fff; font-weight: 700;">${costPerSql} $</td>
          </tr>
          <tr style="border-bottom: 1px solid #222; background: rgba(234, 179, 8, 0.05);">
            <td style="padding: 10px 8px; color: #EAB308; font-weight: 600;">Total Leads</td>
            <td style="padding: 10px 8px; text-align: right; color: #EAB308; font-weight: 700; font-size: 16px;">${formatNumber(campaign.leads)}</td>
          </tr>
          <tr style="border-bottom: 1px solid #222;">
            <td style="padding: 10px 8px; color: #ccc;">Total MQL</td>
            <td style="padding: 10px 8px; text-align: right; color: #fff; font-weight: 700;">${formatNumber(campaign.mql)}</td>
          </tr>
          <tr style="border-bottom: 1px solid #222;">
            <td style="padding: 10px 8px; color: #ccc;">Total SQL</td>
            <td style="padding: 10px 8px; text-align: right; color: #fff; font-weight: 700;">${formatNumber(campaign.sql)}</td>
          </tr>
          <tr style="border-bottom: 1px solid #222;">
            <td style="padding: 10px 8px; color: #ccc;">Total NQ</td>
            <td style="padding: 10px 8px; text-align: right; color: #fff; font-weight: 700;">${formatNumber(campaign.nq)}</td>
          </tr>
          <tr style="border-bottom: 1px solid #222;">
            <td style="padding: 10px 8px; color: #ccc;">Taux MQL / Leads</td>
            <td style="padding: 10px 8px; text-align: right; color: #fff; font-weight: 600;">${formatPercentage(mqlRate)}</td>
          </tr>
          <tr style="border-bottom: 1px solid #222;">
            <td style="padding: 10px 8px; color: #ccc;">Taux SQL / Leads</td>
            <td style="padding: 10px 8px; text-align: right; color: #fff; font-weight: 600;">${formatPercentage(sqlRate)}</td>
          </tr>
          <tr style="border-bottom: 1px solid #222;">
            <td style="padding: 10px 8px; color: #ccc;">Taux SQL / MQL</td>
            <td style="padding: 10px 8px; text-align: right; color: #fff; font-weight: 600;">${formatPercentage(sqlFromMql)}</td>
          </tr>
          <tr>
            <td style="padding: 10px 8px; color: #ccc;">Taux NQ / Leads</td>
            <td style="padding: 10px 8px; text-align: right; color: #fff; font-weight: 600;">${formatPercentage(nqRate)}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div style="border-top: 1px solid #333; padding-top: 16px; text-align: center;">
      <p style="margin: 0; font-size: 10px; color: #555;">Généré par LeadPulse Analytics — ${new Date().toLocaleDateString("fr-FR")}</p>
    </div>
  `;

  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(container, {
      backgroundColor: "#0a0a0a",
      scale: 2,
      useCORS: true,
      logging: false,
    });

    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    const pdf = new jsPDF("p", "mm", "a4");
    const imgData = canvas.toDataURL("image/png");

    let position = 0;
    const pageHeight = 297;

    if (imgHeight <= pageHeight) {
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    } else {
      let remainingHeight = imgHeight;
      while (remainingHeight > 0) {
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        remainingHeight -= pageHeight;
        position -= pageHeight;
        if (remainingHeight > 0) pdf.addPage();
      }
    }

    pdf.save(`LeadPulse_${campaign.campaignId}_${campaign.name.replace(/\s+/g, "_")}.pdf`);
  } finally {
    document.body.removeChild(container);
  }
}
