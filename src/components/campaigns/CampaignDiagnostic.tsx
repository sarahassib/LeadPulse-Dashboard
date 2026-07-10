"use client";

import { Activity, CheckCircle, AlertTriangle } from "lucide-react";
import { CampaignWithCalculations } from "@/types";

interface CampaignDiagnosticProps {
  campaign: CampaignWithCalculations;
}

interface Diagnostic {
  message: string;
  type: "positive" | "warning";
}

function generateDiagnostics(
  campaign: CampaignWithCalculations
): Diagnostic[] {
  const diagnostics: Diagnostic[] = [];

  if (campaign.mqlRate > 25 && campaign.sqlGlobalRate < 4) {
    diagnostics.push({
      message:
        "La campagne génère des leads marketing qualifiés, mais la conversion vers SQL semble limitée. Vérifier la qualité du suivi commercial, le ciblage ou les critères de qualification.",
      type: "warning",
    });
  }

  if (campaign.nqRate > 40) {
    diagnostics.push({
      message:
        "Une part importante des leads est non qualifiée. Vérifier le ciblage, le message, le formulaire ou la promesse de campagne.",
      type: "warning",
    });
  }

  if (campaign.leads > 500 && campaign.mqlRate < 15) {
    diagnostics.push({
      message:
        "Le volume est intéressant, mais la qualification marketing reste faible. Le message pourrait attirer un public trop large.",
      type: "warning",
    });
  }

  if (campaign.sqlGlobalRate >= 5) {
    diagnostics.push({
      message:
        "Cette campagne présente une bonne capacité à générer des prospects commercialement qualifiés.",
      type: "positive",
    });
  }

  if (campaign.leads < 300 && campaign.sqlGlobalRate >= 5) {
    diagnostics.push({
      message:
        "La qualité des leads est bonne, mais le volume reste limité. Tester de nouvelles variantes ou augmenter progressivement la diffusion.",
      type: "warning",
    });
  }

  return diagnostics;
}

export default function CampaignDiagnostic({
  campaign,
}: CampaignDiagnosticProps) {
  const diagnostics = generateDiagnostics(campaign);

  return (
    <div className="bg-surface-card border border-border rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="h-5 w-5 text-text-secondary" />
        <h3 className="text-lg font-semibold text-white">
          Diagnostic de performance
        </h3>
      </div>

      {diagnostics.length === 0 ? (
        <div className="bg-surface-elevated border border-border rounded-lg p-4">
          <p className="text-sm text-text-muted">
            Aucun diagnostic spécifique disponible pour cette campagne.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {diagnostics.map((diagnostic, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 p-4 rounded-lg border ${
                diagnostic.type === "positive"
                  ? "bg-green-50 border-green-200"
                  : "bg-amber-50 border-amber-200"
              }`}
            >
              {diagnostic.type === "positive" ? (
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
              )}
              <p
                className={`text-sm ${
                  diagnostic.type === "positive"
                    ? "text-green-800"
                    : "text-amber-800"
                }`}
              >
                {diagnostic.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

