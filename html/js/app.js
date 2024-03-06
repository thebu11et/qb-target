document.addEventListener("DOMContentLoaded", function () {
    const config = {
        StandardEyeIcon: 'https://cdn.discordapp.com/attachments/1214983609501618176/1214983698848677990/Frame_82_6.png?ex=65fb18bf&is=65e8a3bf&hm=5a5ab80ad8c9ec4c8f4dda0bb4946bc563647181969dd861e00cba0642b42161&', // Instead of icon it's using a image source found in HTML 
        CurrentIcon: 'https://cdn.discordapp.com/attachments/1214983609501618176/1214983698848677990/Frame_82_6.png?ex=65fb18bf&is=65e8a3bf&hm=5a5ab80ad8c9ec4c8f4dda0bb4946bc563647181969dd861e00cba0642b42161&', // Instead of icon it's using a image source found in HTML
        SuccessIcon: 'https://cdn.discordapp.com/attachments/1214983609501618176/1214983727185268786/Frame_83_1.png?ex=65fb18c5&is=65e8a3c5&hm=dff89ecbffdda92eb28730d93848c14c7f05ab42896d05a8a8535ced5f28f464&', // Instead of icon it's using a image source found in HTML
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
