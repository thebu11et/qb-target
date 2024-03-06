document.addEventListener("DOMContentLoaded", function () {
    const config = {
        StandardEyeIcon: "fas fa-eye",
        StandardColor: "white",
        SuccessColor: "#DC143C",
    };

    const targetEye = document.getElementById("target-eye");
    const targetLabel = document.getElementById("target-label");
    const TargetEyeStyleObject = targetEye.style;

    function OpenTarget() {
        targetLabel.textContent = "";
        targetEye.style.display = "block";
        targetEye.className = config.StandardEyeIcon;
        TargetEyeStyleObject.color = config.StandardColor;
    }

    function CloseTarget() {
        targetLabel.textContent = "";
        targetEye.style.display = "none";
    }

    function createTargetOption(index, itemData) {
        if (itemData !== null) {
            index = Number(index) + 1;
            const targetOption = document.createElement("div");
            targetOption.id = `target-option-${index}`;
            targetOption.style.marginBottom = "0.2vh";
            targetOption.style.borderRadius = "0.15rem";
            targetOption.style.padding = "0.45rem";
            targetOption.style.background = "rgba(23, 23, 23, 40%)";
            targetOption.style.color = config.StandardColor;
            const targetIcon = document.createElement("span");
            targetIcon.id = `target-icon-${index}`;
            const icon = document.createElement("i");
            icon.className = itemData.icon;
            targetIcon.appendChild(icon);
            targetIcon.appendChild(document.createTextNode(" "));
            targetOption.appendChild(targetIcon);
            targetOption.appendChild(document.createTextNode(itemData.label));
            targetLabel.appendChild(targetOption);
        }
    }

    function FoundTarget(item) {
        if (item.data) {
            targetEye.className = item.data;
        }
        TargetEyeStyleObject.color = config.SuccessColor;
        targetLabel.textContent = "";
        for (let [index, itemData] of Object.entries(item.options)) {
            createTargetOption(index, itemData);
        }
    }

    function ValidTarget(item) {
        targetLabel.textContent = "";
        for (let [index, itemData] of Object.entries(item.data)) {
            createTargetOption(index, itemData);
        }
    }

    function LeftTarget() {
        targetLabel.textContent = "";
        TargetEyeStyleObject.color = config.StandardColor;
        targetEye.className = config.StandardEyeIcon;
    }

    function handleMouseDown(event) {
        const element = event.target; // use const instead of let
        if (element.id) {
            const split = element.id.split("-");
            if (split[0] === "target" && split[1] !== "eye" && event.button === 0) {
                fetch(`https://${GetParentResourceName()}/selectTarget`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json; charset=UTF-8" },
                    body: JSON.stringify(split[2]),
                }).catch((error) => console.error("Error:", error));
                targetLabel.textContent = "";
            }
        }
        if (event.button === 2) {
            LeftTarget();
            fetch(`https://${GetParentResourceName()}/leftTarget`, {
                method: "POST",
                headers: { "Content-Type": "application/json; charset=UTF-8" },
                body: "",
            }).catch((error) => console.error("Error:", error));
        }
    }

    function handleKeyDown(event) {
        if (event.key === "Escape" || event.key === "Backspace") {
            CloseTarget();
            fetch(`https://${GetParentResourceName()}/closeTarget`, {
                method: "POST",
                headers: { "Content-Type": "application/json; charset=UTF-8" },
                body: "",
            }).catch((error) => console.error("Error:", error));
        }
    }

    function handleMouseOver(event) {
        const element = event.target;
        if (element.id) {
            const split = element.id.split("-");
            if (split[0] === "target" && split[1] === "option") {
                element.style.transform = "translateX(10px)";
                element.style.transition = "transform 0.3s ease";
            }
        }
    }

    function handleMouseOut(event) {
        const element = event.target;
        if (element.id) {
            const split = element.id.split("-");
            if (split[0] === "target" && split[1] === "option") {
                element.style.transform = "translateX(0)";
            }
        }
    }

    window.addEventListener("message", function (event) {
        switch (event.data.response) {
            case "openTarget":
                OpenTarget();
                break;
            case "closeTarget":
                CloseTarget();
                break;
            case "foundTarget":
                FoundTarget(event.data);
                break;
            case "validTarget":
                ValidTarget(event.data);
                break;
            case "leftTarget":
                LeftTarget();
                break;
        }
    });

    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("mouseout", handleMouseOut);

    window.addEventListener("unload", function () {
        window.removeEventListener("mousedown", handleMouseDown);
        window.removeEventListener("keydown", handleKeyDown);
        window.removeEventListener("mouseover", handleMouseOver);
        window.removeEventListener("mouseout", handleMouseOut);
    });
});


StandardEyeIcon: 'https://cdn.discordapp.com/attachments/906217014836731955/1210918920274452500/Frame_82_6.png?ex=65ec4f20&is=65d9da20&hm=987b54f7a23a7216996baa2ea32375fdbc1bb79b0fd1606331b0c79e7d55a1d6&', // Instead of icon it's using a image source found in HTML 
CurrentIcon: 'https://cdn.discordapp.com/attachments/906217014836731955/1210918920274452500/Frame_82_6.png?ex=65ec4f20&is=65d9da20&hm=987b54f7a23a7216996baa2ea32375fdbc1bb79b0fd1606331b0c79e7d55a1d6&', // Instead of icon it's using a image source found in HTML
SuccessIcon: 'https://cdn.discordapp.com/attachments/906217014836731955/1210918920807251968/Frame_83_1.png?ex=65ec4f20&is=65d9da20&hm=e80b985b70c317ed8b6a31b3c215218f86e3096d739fe4aee1bad40d2caade6c&', // Instead of icon it's using a image source found in HTML