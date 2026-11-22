"use client";
import { Fragment, useEffect, useState, type ReactNode } from "react";
import {
  type ContentBlock,
  type RichText,
  type ContentKind,
  plain,
  safeUrl,
} from "@/lib/notion/model";
import styles from "@/app/portfolio.module.css";

function Rich({ items }: { items: RichText[] }) {
  return (
    <>
      {items.map((item, index) => {
        let content: ReactNode = item.plain_text ?? item.text?.content ?? "";
        const a = item.annotations;
        if (a?.code) content = <code>{content}</code>;
        if (a?.bold) content = <strong>{content}</strong>;
        if (a?.italic) content = <em>{content}</em>;
        if (a?.strikethrough) content = <s>{content}</s>;
        if (a?.underline) content = <u>{content}</u>;
        const href = safeUrl(item.href ?? item.text?.link?.url);
        if (href)
          content = (
            <a href={href} target="_blank" rel="noreferrer">
              {content}
            </a>
          );
        return <Fragment key={index}>{content}</Fragment>;
      })}
    </>
  );
}
function Blocks({ items }: { items: ContentBlock[] }) {
  const nodes: ReactNode[] = [];
  for (let i = 0; i < items.length; i++) {
    const block = items[i];
    if (["bulleted_list_item", "numbered_list_item"].includes(block.type)) {
      const group = [block];
      while (items[i + 1]?.type === block.type) group.push(items[++i]);
      const children = group.map((b) => (
        <li key={b.id}>
          <Rich items={b.text} />
          <Blocks items={b.children} />
        </li>
      ));
      nodes.push(
        block.type === "numbered_list_item" ? (
          <ol key={block.id}>{children}</ol>
        ) : (
          <ul key={block.id}>{children}</ul>
        ),
      );
      continue;
    }
    const children = <Blocks items={block.children} />;
    const rich = <Rich items={block.text} />;
    let node: ReactNode;
    switch (block.type) {
      case "heading_1":
      case "heading_2":
      case "heading_3": {
        const Tag =
          block.type === "heading_1"
            ? "h3"
            : block.type === "heading_2"
              ? "h4"
              : "h5";
        node = block.toggleable ? (
          <details>
            <summary>{rich}</summary>
            {children}
          </details>
        ) : (
          <>
            <Tag>{rich}</Tag>
            {children}
          </>
        );
        break;
      }
      case "paragraph":
        node = (
          <>
            <p>{rich}</p>
            {children}
          </>
        );
        break;
      case "toggle":
        node = (
          <details>
            <summary>{rich}</summary>
            {children}
          </details>
        );
        break;
      case "quote":
        node = (
          <blockquote>
            {rich}
            {children}
          </blockquote>
        );
        break;
      case "callout":
        node = (
          <aside>
            {rich}
            {children}
          </aside>
        );
        break;
      case "code":
        node = (
          <>
            <pre>
              <code>{plain(block.text)}</code>
            </pre>
            {block.caption?.length ? (
              <p>
                <Rich items={block.caption} />
              </p>
            ) : null}
          </>
        );
        break;
      case "divider":
        node = <hr />;
        break;
      case "to_do":
        node = (
          <div>
            <span aria-label={block.checked ? "Completed" : "Not completed"}>
              {block.checked ? "☑" : "☐"}
            </span>{" "}
            {rich}
            {children}
          </div>
        );
        break;
      case "image":
        node = block.url ? (
          <figure>
            <img
              src={block.url}
              alt={plain(block.caption ?? []) || "Project illustration"}
              loading="lazy"
            />
            <figcaption>
              <Rich items={block.caption ?? []} />
            </figcaption>
          </figure>
        ) : null;
        break;
      case "table":
        node = (
          <div className={styles.tableScroll}>
            <table>
              <tbody>
                {block.children.map((row, index) => (
                  <tr key={row.id}>
                    {row.cells?.map((cell, j) =>
                      block.columnHeader && index === 0 ? (
                        <th key={j}>
                          <Rich items={cell} />
                        </th>
                      ) : (
                        <td key={j}>
                          <Rich items={cell} />
                        </td>
                      ),
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        break;
      case "column":
      case "column_list":
        node = children;
        break;
      case "equation":
        node = <pre>{rich}</pre>;
        break;
      case "file":
      case "pdf":
      case "video":
      case "embed":
      case "bookmark":
      case "link_preview":
        node = block.url ? (
          <p>
            <a href={block.url} target="_blank" rel="noreferrer">
              {plain(block.caption ?? []) ||
                `Open ${block.type === "bookmark" ? "link" : block.type}`}
            </a>
          </p>
        ) : null;
        break;
      default:
        node = (
          <p className={styles.contentNotice}>
            This content format is not displayed here.
          </p>
        );
    }
    nodes.push(<Fragment key={block.id}>{node}</Fragment>);
  }
  return <>{nodes}</>;
}
export default function NotionContent({
  kind,
  id,
}: {
  kind: ContentKind;
  id: string;
}) {
  const [blocks, setBlocks] = useState<ContentBlock[] | null>(null);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setBlocks(null);
    setError("");
    fetch(`/api/notion/${kind}/${encodeURIComponent(id)}`, {
      signal: controller.signal,
      cache: "no-store",
    })
      .then(async (response) => {
        if (!response.ok)
          throw new Error(
            response.status === 404
              ? "This content is no longer published."
              : "Unable to load this content. Please try again.",
          );
        return response.json();
      })
      .then((data) => setBlocks(data.blocks))
      .catch((error) => {
        if (!controller.signal.aborted) setError(error.message);
      });
    return () => controller.abort();
  }, [kind, id, attempt]);
  if (error)
    return (
      <div role="status">
        <p>{error}</p>
        <button
          className={styles.lightButton}
          onClick={() => setAttempt((n) => n + 1)}
        >
          Try again
        </button>
      </div>
    );
  if (!blocks)
    return (
      <div className={styles.contentLoading} role="status">
        <span className={styles.loadingCharacter} aria-hidden="true">
          <img src="/images/character/search.png" alt="" />
        </span>
        <p>Loading content…</p>
      </div>
    );
  return (
    <div className={styles.notionContent}>
      {blocks.length ? (
        <Blocks items={blocks} />
      ) : (
        <p>No additional details yet.</p>
      )}
    </div>
  );
}
